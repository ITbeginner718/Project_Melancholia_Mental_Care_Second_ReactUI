import { Unsubscribe, collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import { Button, Card, CardHeader, Row, Table } from "reactstrap";
import ChatbotFeedbackList from "./chatbotFeedbackList";


//인터페이스 작성 
export interface IMainChatbotFeedback {
    ChatbotDate: string;
    feedbackData: string;
    feedbackAddExplain: string;
    userID: string;
    id:string;
}



export default function MainChatbotFeedback() {

    // 사용자 정보
    const user = auth.currentUser;

    // 배열 설정
    const [chatbotFeedbacks, setChatbotFeedbacks] = useState<IMainChatbotFeedback[]>([]);

    useEffect(() => {

        // useEffect는 1번만 실행(사실 1번만 실행되게 했어도 2번 실행)
        let unsubscribe: Unsubscribe | null = null;

        // 사용자가 작성한 tweet만 보여주기
        const fetchChatbotFeedback = async () => {
            const chatbotFeedbackQuery = query(
                collection(db, "chatbotFeedbacks"),
                // 유저 ID가 같은 트윗들만 가져오기
                // profile.tsx:116 Uncaught (in promise) 
                // FirebaseError: The query requires an index
                // what the fucking index?
                /*
                    => where("userId", "==", user?.uid), 
                    이러한 필터 명령어를 firestore에 알려야 함
                    오류에서 제공하는 url 사이트로 이동
                    */
                where("userID", "==", user?.uid),
                orderBy("Credential", "desc"),
                limit(25),
            );
            // 해당 쿼리 명령대로 값 import
            // const snapshot = await getDocs(chatbotFeedbackQuery);
            unsubscribe = await onSnapshot(chatbotFeedbackQuery/* 쿼리 등록*/, (snapshot) => {
                // 값 배열에 저장
                const chatbotFeedbacks = snapshot.docs.map(
                    (document) => {
                        const { ChatbotDate, feedbackData, feedbackAddExplain,userID } = document.data();

                       

                        return {
                            ChatbotDate, feedbackData, feedbackAddExplain,userID, id:document.id,
                            
                    }
                }

                );

                setChatbotFeedbacks(chatbotFeedbacks);
            })
        }

        fetchChatbotFeedback();


        return () => {

            // 타임라인 컴포넌트가 마운트될때 구독
            // 언마운트되면 구독 취소
            //해당 함수가 호출되면 onSnapshot작동이 중지 됨
            unsubscribe && unsubscribe();// => unsubcribe가 참으로 간주되면 unsubscribe()호출된다는 뜻
            console.log("boardUnsubcribe called");
        }

    }, [])


    return (
        <>
            <Card className="shadow">
                <CardHeader className="border-0">
                    <Row className="align-items-center">
                        <div className="col">
                            <h3 className="mb-0">오늘의 기억하기</h3>
                        </div>
                        <div className="col text-right">
                            <Button
                                color="primary"
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                                size="sm"
                            >
                                See all
                            </Button>
                        </div>
                    </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">chatbot date</th>
                            <th scope="col">feedback</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            chatbotFeedbacks.map((chatbotFeedback) => (
                                <ChatbotFeedbackList key={chatbotFeedback.userID} {...chatbotFeedback} />
                            ))
                        }
                    </tbody>
                </Table>
            </Card>

        </>
    );
}   