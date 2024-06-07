import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';

//인터페이스 작성 
export interface IDiagResult {
    userName?: string | null | undefined;
    resultScore: string;
    resultText: string;
}

export interface IReultFeedback {
    resultFeedback: string | undefined;
}

export default function ChatbotDiagnoseResult({ userName, resultScore, resultText }: IDiagResult) {

    const navigate = useNavigate();

    // // 진단 결과 텍스트
    const [resultFeedbackText, setResultFeedbackText] = useState('');

    // 모달 state
    const [modal, setModal] = useState(false);

    // 모달 이벤트
    const toggle = () => setModal(!modal);

    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {
        // resultFeedback(resultText)가 undefined일 경우 기본값으로 빈 문자열('')을 설정
        // resultFeedback(resultText) 함수가 undefined를 반환할 가능성이 있을 때.
        // undefined 대신 반드시 문자열 값이 필요할 때.
        const text = resultFeedback(resultText) ?? '';

        setResultFeedbackText(text);

        toggle();

    }, []);


    const onClickProfile = () => {
        toggle();
        navigate("/admin/user-profile");
    }


    const resultFeedback = (resultText: string | undefined) => {

        if (resultText === "양호") {
            return `현재 ${userName}님의 우울증 상태는 대체적으로 좋습니다.`;
        }

        else if (resultText === "보통") {
            return `다행이도 현재 ${userName}님의 상태는 보통 상태으로 걱정할 상태는 아니에요.`;
        }

        else if (resultText === "경증") {
            return `현재 ${userName}님의 상태는 약간의 우울감이 있는 수준입니다.`;
        }

        else if (resultText === "심각") {
            const text = `현재 ${userName}님의 상태는 우울증이 예상되는 수준이에요.
                지금  ${userName}님이 겪고 있는 어려움은 정말 힘든 일이라는 걸 잘 알고 있어요. 
                우울증이 있다는 것은 결코 당신이 약하거나 잘못된 사람이란 의미가 아니에요.
                 오히려 자신의 상태를 인정하고 도움을 요청하는 용기를 보여준 당신은 정말 강한 사람입니다.
                 ${userName}의 건강과 행복은 무엇보다 중요합니다. 
                치료는  ${userName}님이 일상에서 다시 기쁨을 찾고, 더 밝은 미래를 향해 나아가는 첫 걸음이 될 거예요. 
                전문가들의 도움을 받으면 지금의 어려움을 함께 극복할 수 있을 것입니다. 
                치료를 통해 점차 나아지는  ${userName}님의 모습을 보며 많은 사람들이 응원하고 지지할 거예요. 
                그러니 우리 함께 치료의 여정을 시작해 보는 건 어떨까요?  ${userName}은 절대 혼자가 아니라는 것을 알려주고 싶어요. 
                우리는 모두  ${userName}님의 편입니다.`;
            return text;
        }
    }

    return (
        <>
            {/* 결과창  */}
            <Modal isOpen={modal} toggle={toggle} fullscreen="true" backdrop="static">
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>

                    우울증 진단 검사 결과:
                    <Alert color="primary">
                        {resultScore} 점으로 {resultText}으로 판단됩니다.
                    </Alert>

                    <hr />

                    <Alert>
                        <h4 className="alert-heading">
                            마음e:
                        </h4>
                        <p>
                        {resultFeedbackText}
                        </p>
                        
                    </Alert>

                   

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={onClickProfile}>
                        상세 정보
                    </Button>{' '}

                </ModalFooter >
            </Modal>
        </>
    )

}