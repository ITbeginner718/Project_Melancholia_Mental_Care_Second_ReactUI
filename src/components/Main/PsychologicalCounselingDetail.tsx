

import Header from "@components/Headers/Header";
import { useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Spinner } from "reactstrap";

import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import ProfileImageChatbot from "../../assets/img/theme/GraidentAiRobot.jpg";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { query, collection, where, orderBy, getDocs, doc, getDoc } from "firebase/firestore";

//인터페이스 작성 
export interface ICounselRecord {

    content: string,
    role:string
}




export default function PsychologicalCounselingDetail() {

    // 게시판 정보 id값 가져오기
    const { counselId } = useParams();
    const doc_id = counselId;
    const user=auth.currentUser;
     // 배열 설정
    const [counsels, setCounsels] = useState<ICounselRecord[]>([]);
    // 프로필 이미지(사용자)
    const ProfileImageUser = user?.photoURL;

    // 특정 문서 ID를 이용하여 데이터를 가져오는 비동기 함수
    async function getDocumentData() {
        //타입이 string인지 체크
        if (typeof doc_id === "string") {
          // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
          const docRef = doc(db, "counseling", doc_id);
  
          // 참조를 사용하여 문서 정보 가져오기
          const docSnap = await getDoc(docRef);
  
          // 문서의 존재 여부 확인 및 데이터 출력
  
          //해당 쿼리에 대한 모든 문서 반환 
          if (docSnap.exists()) {

            console.log("데이터 존재");
            const {counselingRecord}  = docSnap.data();

            setCounsels(counselingRecord);
       
          }
          else
          {
            console.log("Data not exist");
          }
        }
  
      }
  
 
     useEffect(() => {
         // 데이터 불러오기
         getDocumentData();
     }, [])
 
    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--6" fluid>
                <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                            <Col xs="8">
                                <h3 className="mb-0">AI감성 챗봇</h3>
                            </Col>
                            <Col className="text-right" xs="4">
                                <Button
                                    color="primary"
                                    href="#pablo"
                                    size="lm"
                                >
                                    상담 기록
                                </Button>

                            </Col>
                        </Row>
                    </CardHeader>

                    <CardBody>

                        {/* 챗봇 컴포넌트 */}
                        <div className="App">
                            <div className="chat-container">
                                <ul className="message-list">
                                    {/* messages 배열을 순회하면서 각 메시지를 출력합니다. map 함수는 msg와 index를 받아 JSX 요소를 반환합니다. */}
                                    {counsels && counsels.map((counsel) => (
                                        <li  className="message-item">
                                            {counsel.role === 'assistant' && <img src={ProfileImageChatbot} alt="Receiver Profile" className="profile-pic " />}

                                            <div className={counsel.role === 'assistant' ? 'message received' : 'message sent'}>

                                                {counsel.role === 'assistant' && <span className="message-content">{counsel.content}</span>}

                                                {counsel.role === 'user' && (ProfileImageUser ? <img src={ProfileImageUser} alt="Sender Profile" className="profile-pic" /> :
                                                    <svg className="profile-pic" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>)}

                                                {counsel.role === 'user' && <span className="message-content">{counsel.content}</span>}

                                        
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Container>

        </>
    )
}