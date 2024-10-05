import React, { useEffect, useState } from 'react';
import YouTube from "react-youtube";
import { io, Socket } from 'socket.io-client';

import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input, FormFeedback, FormText, Badge } from 'reactstrap';

import { IDiary } from 'views/examples/Profile';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

interface VideoContent {
    videoId: string;
    title: string;
}


const opts = {
    width: 400,
    height: "390",
    playerVars: {
        autoplay: 0,
    },
};



// 타입 스크립트 props 받는 방법
export default function MediaModalFullscreen({ id }: { id: string }) {
    const [modal, setModal] = useState(false);

    // 일기 내용
    const [updateDiaryContent, setDiaryContent] = useState("");

    // 일기 예측 감정
    const [diaryFeeling, setDiaryFeeling] = useState("");

    // 현재 유저를 불러오기 
    const user = auth.currentUser;

    const userName = user?.displayName;

    useEffect(() => {
        async function getDocumentData() {
            if (typeof id === "string") {
                const docRef = doc(db, "diaries", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as IDiary;
                    setDiaryContent(data.diaryContent);

                    if (data.feeling != null) {
                        setDiaryFeeling(data.feeling);
                    }

                }
            }
        }
        getDocumentData();
    }, [id]);


    //Socket io 
    const [socket, setSocket] = useState<Socket | null>(null);

    // 결과값 받기 
    const [mediaContentResult, setMediaContentResult] = useState<VideoContent[]>();

    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {
        //웹크롤링 nodeJS 서버 
        const newSocket = io('http://localhost:4900');
        setSocket(newSocket);
    }, []);

    // 결과값 받기
    useEffect(() => {
        // socket 상태가 null이 아닐 때만 실행
        if (socket) {
            console.log("WebScrawling Node.Js Server Connect");

            socket.on('community message', (msg) => {
                setMediaContentResult(msg);
                // 모달 출력
                toggle();
            });
        }

        //  클린업 함수가 실행(이벤트 리스너 해제 및 연결 종료)
        return () => {
            if (socket) {
                console.log("WebCrawling Node.Js Server Disconnect");
                // 이벤트 리스너 해제
                socket.off('community message');
                // 실제 소켓 연결을 종료합니다.
                socket.disconnect();
                setSocket(null);
            }
        };

    }, [socket]); // socket 상태를 의존성 배열에 추가: setSocket()을 사용하여 할당한다고 하더라도 즉시 할당되는 것은 아니므로
    //의존성 배열에 socket state를 설정하여socket state에 값이 설정되면 그때 실행되도록 설정

    const toggle = () => setModal(!modal);

    // 컨텐츠 전송
    const sendMediaContent = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("시작");
        e.preventDefault();

        // setMediaContentResult(undefined);

        if (diaryFeeling) {

            // 단어별 미디어 추천 서비스
            const mediaContentTitle = getMediaContentKeyword(diaryFeeling);

            // 예외처리
            if (mediaContentTitle === "NotRecommand") {
                alert(`해당 ${diaryFeeling} 감정에 대해서 추천 미디어 서비스를 제공하지 않습니다.`)
                return;
            }

            // 추천 미디어 서비스 실행
            else {

                if (socket) {
                    try {
                        // 메세지 전송
                        socket.emit('community message', mediaContentTitle);
                        
                        console.log("전송완료:" ,mediaContentTitle );
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    };

    function getMediaContentKeyword(mediaContentText: string) {

        if (mediaContentText.includes("우울")) {
            return "우울하고 무기력할 때 위로가 되는 노래 영상"
        }

        else if (mediaContentText.includes("슬픔")) {
            return "슬픔 때 노래 영상"
        }

        else if (mediaContentText.includes("불안")) {
            return "불안할 때 노래 영상"
        }

        else if (mediaContentText.includes("공허함")) {
            return "공허할 때 노래 영상"
        }

        else if (mediaContentText.includes("외로움")) {
            return "외로울 때 노래 영상"
        }

        else if (mediaContentText.includes("좌절")) {
            return "좌절할 때 노래 영상"
        }

        else if (mediaContentText.includes("자책")) {
            return "자책할 때 노래 영상"
        }

        else if (mediaContentText.includes("절망")) {
            return "절망적일 때 노래 영상"
        }

        else if (mediaContentText.includes("지침")) {
            return "지치고 힘들 때 듣고 싶은 노래 영상"
        }

        else {
            return "NotRecommand"
        }
    }

    return (

        <>
            <div>
                <Form onSubmit={sendMediaContent}>
                    <FormGroup>

                        <Label for="exampleEmail">
                            {`${userName}님의 일기 감정 분석 결과:`}
                            <Badge color="primary" style={{ fontSize: "15px" }}>    
                                {`"${diaryFeeling}" `}
                            </Badge>
                            {"으로 예상됩니다. 해당 감정에 맞는 미디어를 추천해드립니다."}
                        </Label>


                        <FormFeedback tooltip>
                            You will not be able to see this
                        </FormFeedback>
                        
                        <FormText>
                            일기 내용
                        </FormText>

                        <Input
                            rows={10}
                            maxLength={180}
                            value={updateDiaryContent}
                            id="exampleText"
                            name="text"
                            type="textarea"
                            readOnly={true}
                        />

                    </FormGroup>

                    <hr />
                    <Button color="danger" type="submit">
                        미디어 추천 영상
                    </Button>
                </Form>
            </div>

            <div>

                <Modal isOpen={modal} toggle={toggle} fullscreen="true" backdrop="static">
                    <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        미디어 화면
                        <div className="popularChart youtube">
                            <Row className="mb-3" style={{ marginTop: 40, marginLeft: 40 }}>
                            </Row>
                            <div className="centeral">
                                <div
                                    style={{
                                        margin: 20,
                                        display: "flex",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        width: "80%",
                                    }}
                                >
                                    {
                                        mediaContentResult ?
                                            mediaContentResult.map((item, index) => (
                                                <Col>
                                                    <Row
                                                        // className="justify-content-center"
                                                        style={{ padding: "10px 0" }}
                                                    >
                                                        <YouTube key={index} videoId={item.videoId} opts={opts} />
                                                        <div>
                                                            {item.title.replace(/&QUOT;/gi, '"')}
                                                        </div>
                                                    </Row>
                                                </Col>
                                            )) : null
                                    }
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={toggle}>
                            Do Something
                        </Button>{' '}

                        <Button color="secondary" onClick={toggle}>
                            Cancel
                        </Button>
                    </ModalFooter >
                </Modal>
            </div>
        </>
    );
}