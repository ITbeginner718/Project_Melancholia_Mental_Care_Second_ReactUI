import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle, CardSubtitle, CardText, Card } from 'reactstrap';

//인터페이스 작성 
export interface IFeedback {
    feedbackData: string;
    summaryData: string;
}


export default function ChatbotFeedback({ feedbackData, summaryData }: IFeedback) {

    const navigate = useNavigate();

    // 챗봇 피드백 키워드
    const [chatbotFeedback, setChatbotFeedback] = useState('');

    // 챗봇 피드백 부가 설명
    const [chatbotSummaryData, setchatbotSummaryData] = useState('');

    // 모달 state
    const [modal, setModal] = useState(false);

    // 모달 이벤트
    const toggle = () => setModal(!modal);

    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {

        setChatbotFeedback(feedbackData);
        setchatbotSummaryData(summaryData);

        toggle();
    }, []);


    const onClickMainIndex = () => {
        toggle();
        // 메인페이지로 이동
        navigate("/admin/index");
    }


    return (
        <>
            {/* 결과창  */}
            <Modal isOpen={modal} toggle={toggle} fullscreen="true" backdrop="static">
                <ModalHeader toggle={toggle}>꼭 기억해주세요</ModalHeader>
                <ModalBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* :{chatbotFeedback}
                    부가설명:{chatbotFeedbackAddExplain}     */}

                    <Card
                        style={{
                            width: '32rem'
                        }}
                    >
                        <img
                            alt="Sample"
                            src="https://previews.123rf.com/images/halfpoint/halfpoint1308/halfpoint130800063/21957424-%ED%96%89%EB%B3%B5%ED%95%9C-%EA%B0%80%EC%A1%B1.jpg"
                        />
                        <CardBody>
                            <CardTitle tag="h1">
                                기억하기!
                            </CardTitle>
                            <CardSubtitle
                                className="mb-2 text-muted"
                                tag="h3"
                            >
                                오늘의 상담 피드백
                            </CardSubtitle>
                            <CardText>
                            {chatbotFeedback}
                            </CardText>
                            
                            <br/>
                            
                            <CardSubtitle
                                className="mb-2 text-muted"
                                tag="h3">
                                오늘의 상담 주요 내용
                            </CardSubtitle>
                            <CardText>
                            {chatbotSummaryData}
                            </CardText>
                        </CardBody>
                    </Card>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={onClickMainIndex}>
                        메인으로 이동
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </>
    )

}