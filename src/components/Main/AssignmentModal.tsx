import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

//인터페이스 작성 
export interface IAssignment {
    feedback:string;
    summary:string;
    onActionClick: () => void;  // 파라미터 없는 함수
}

export default function AssignmentModal({feedback, summary, onActionClick}:IAssignment)
{
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    useEffect(()=>{
        toggle();

    },[])
    return(
        <>
            {/* 결과창  */}
            <Modal isOpen={modal} toggle={toggle} fullscreen="true" backdrop="static">
                <ModalHeader toggle={toggle} tag="h2">꼭 기억해주세요</ModalHeader>
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
                            src="https://png.pngtree.com/thumb_back/fh260/background/20220313/pngtree-in-the-early-morning-sunshine-forest-image_1009083.jpg"
                        />
                        <CardBody>
                            <CardTitle tag="h4">
                                상담 요약 내용
                            </CardTitle>
                            <CardSubtitle
                                className="mb-2 text-muted"
                                tag="h2"
                            >
                                 Summary
                            </CardSubtitle>
                            <CardText>
                            {summary}
                            </CardText>

                            <CardSubtitle
                                className="mb-2 text-muted"
                                tag="h2">
                                Feedback
                            </CardSubtitle>
                            <CardText>
                            {feedback} 
                            </CardText>
                        </CardBody>
                    </Card>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={onActionClick}>
                        닫기
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </>
    )
}