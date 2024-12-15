
// core components
// 윗쪽 
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import ChatbotFeedback from './ChatbotFeedback_Modal';
import ProfileImageChatbot from "../../assets/img/theme/GraidentAiRobot.jpg";
import Header from '@components/Headers/Header';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Spinner } from 'reactstrap';
import { useParams } from 'react-router-dom';


// 메시지 타입 선언
type Messages = {
    text: string;
    type: 'received' | 'sent'; // 'type' 필드가 받을 수 있는 값으로 'received'와 'sent'로 제한
};


interface TypingEffectProps {
    anymation_text: string; // 애니메이션으로 출력할 텍스트
    speed: number;          // 타이핑 속도 (밀리초)
}

// 타이핑 애니메이션
const TypingEffect = ({ anymation_text, speed }: TypingEffectProps) => {
    const [displayedText, setDisplayedText] = useState(""); // 화면에 보여질 텍스트
    const [index, setIndex] = useState(0); // 현재 출력할 텍스트의 인덱스

    useEffect(() => {
        if (index < anymation_text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + anymation_text[index]); // 하나씩 글자 추가
                setIndex((prev) => prev + 1); // 다음 글자를 가리키도록 인덱스 업데이트
            }, speed);

            return () => clearTimeout(timeout); // cleanup 함수로 timeout 해제
        }
    }, [index, anymation_text, speed]); // index가 변경될 때마다 effect 실행

    return <div>{displayedText}</div>;
};


export default function ChatbotCounsel() {

    // 현재 유저를 불러오기 
    const user = auth.currentUser;

    // 게시판 정보 id값 가져오기
    const { keyword, counselId } = useParams();

    //Socket io 
    const [socket, setSocket] = useState<Socket | null>(null);
    // 현재 입력 필드에 입력된 메세지 필드
    const [message, setMessage] = useState('');
    // 채팅 메시지 목록, 
    const [messages, setMessages] = useState<Messages[]>([]);
    // 프로필 이미지(사용자)
    const ProfileImageUser = user?.photoURL;

    // 챗봇 피드백 키워드 
    const [chatbotFeedback, setChatbotFeedback] = useState('');

    // 챗봇 피드백 키워드 부가 설명
    const [chatbotFeedbackExplain, setChatbotFeedbackExplain] = useState('');

    // 모달 state
    const [modal, setModal] = useState(false);

    // 사용자 이름
    const [userName, setUserName] = useState('');

    // 상담 주제 가져오기
    const [topic, setTopic]= useState<string>();

    // 피드백(gpt) 
    const [counselFeedback, setCounselFeedback]= useState('');
    
    // 요약(gpt)
    const [counselSummary, setCounselSummary]= useState('');

    // 버튼 비/활성화
    const [isButton, setIsButton]=useState(false);

    // 피드백 및 요약 데이터 로딩
    const [isFeedbackAndSummaryLoading, setIsFeedbackAndSummary] = useState(false);

    // 과거 상담 키워드 위주의 대화 기록 state
    const [counselKeywordRecord, setCounselKeywordRecord] = useState<string|null>(null);

    //  소켓 객체 할당 여부 상태
    const [isActivateSocket, setIsActivateSocket]= useState<boolean>(false);

    // 지난 대화 피드백
    const [pastFeedback, setPastFeedback]=useState<string>("");


    //페이지 이동 시 
    useEffect(() => {
        // 페이지를 떠나기 전에 확인 요청
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        const message = "정말 이 페이지를 떠나시겠습니까?";
        e.returnValue = message; // Chrome에서 필요
        return message; // 다른 브라우저에서 필요
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
        return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); // 빈 의존성 배열을 사용해서 컴포넌트 마운트 시에만 이벤트 리스너를 추가하고, 언마운트 시에 제거


    // 상담 주제 저장 및 키워드 가져오기
    useEffect(()=>{

        try {
            if(keyword!=undefined)
                {
                    setTopic(decodeURI(decodeURIComponent(keyword)) ) 
                }
            
            console.log("1. 최근 상담 요약본 여부 확인하기");
             //counselId값이 없으면...
            
            if(counselId==="null")
                {

                    console.log("1-2 요약본 없음");
                    //대화내역을 불러올 id값이 없으면 활성화
                    setIsActivateSocket(true);
                }
           // counselId값이 있으면
            else
            {
                    console.log("1-1.요약본 있음");
                    //여기서 부터 시작해야 함
                    //await로 함수 실행
                  
                    getCounselKeywordRecord();
            }
        } catch (error) {
            console.log("error:",error);
        }
    },[])

    //firebase 데이터가 다 들어오면 활성화
    useEffect(()=>{
        console.log("counselKeywordRecord",counselKeywordRecord)
        if(counselKeywordRecord)
        {
            setIsActivateSocket(true);
        }
    },[counselKeywordRecord])

    

     // 특정 문서 ID를 이용하여 데이터를 가져오는 비동기 함수
    const  getCounselKeywordRecord = async ()=> {
        //타입이 string인지 체크
        if (typeof counselId === "string") {
          // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
          const docRef = doc(db, "counseling", counselId);
  
          // 참조를 사용하여 문서 정보 가져오기
          const docSnap = await getDoc(docRef);
  
          // 문서의 존재 여부 확인 및 데이터 출력
  
          //해당 쿼리에 대한 모든 문서 반환 
          if (docSnap.exists()) {

            console.log("데이터 존재");
            const {counselKeywordRecord, conuselingFeedback}  = docSnap.data();
            console.log(counselKeywordRecord)
            setCounselKeywordRecord(counselKeywordRecord);
            setPastFeedback(conuselingFeedback);
       
          }
        }
  
      }


    // 먼저 대화 내역을 불러온 후에 할당 시작
    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {

  
        if(isActivateSocket===true)
        {
            console.log("2. 소켓 객체 할당하기");
                // SocketIO 통신 요청
            const newSocket = io('http://localhost:3002', {
                reconnection: true, // 재연결 시도 활성화
                reconnectionAttempts: 5, // 최대 재연결 시도 횟수
            });

            setSocket(newSocket);
        }

        
    }, [isActivateSocket]);


    // 사용자 이름
    useEffect(() => {
        const userDisplayName = user?.displayName;

        if (userDisplayName) {
            setUserName(userDisplayName.replace(/\s/g, '_'));
        }

    }, []);

    // Callback (챗봇 처음 시작 시)
    const callBack_setRoomName =( userName:string, topic:string, key:string)=>{
        console.log( "이름:", userName, "주제:", topic,"대화 키:", key);
    }

    // Callback (상담 요약 및 피드백 데이터 받기)
    const callBack_setFeedbackSummary=(feedback:string, summary:string, counselKeywordRecord:string) =>{
        console.log("feedback:",feedback);
        console.log("summary:",summary);
        console.log("counselRecord:", counselKeywordRecord);

        setCounselFeedback(feedback);
        setCounselSummary(summary);

        setIsButton(true);
        //Feed Summary 데이터 받았으면 토글 해제
        setIsFeedbackAndSummary(false);
    }
    
    // Callback (상담 시작(진행) 시작)
    const callBack_setStartChat_ing =(userName:string, topic:string, key:string)=>
    {
        console.log("상담 시작(진행)");
        console.log("userName:",userName);
        console.log("topic:",topic);
        console.log("key:",key);
    }

    // 메세지 시작
    useEffect(() => {
        // socket 상태가 null이 아닐 때만 실행
        if (socket) {

            // 메시지 수신 사용자 이벤트(receive)
            socket.on('socket connect',(msg)=>{
                console.log(msg);
            });
            
            console.log("counselKeywordRecord:", counselKeywordRecord);
            // AI CBT 시작(처음)
            if(counselKeywordRecord===null) 
            {
                console.log("상담 처음 시작 ");
                socket.emit('start chat', `인지행동치료시작`, {userName}, {topic}, callBack_setRoomName);
            }

            else
            {
                console.log("상담 이어서 시작....  ");
                 socket.emit('start chat_ing', `인지행동치료시작_진행`, {userName}, {topic},{counselKeywordRecord},{pastFeedback},callBack_setStartChat_ing );
            }


            // AI CBT 시작(진행)
            console.log("Node.Js Server Connect");
        }

        if (socket) {
            // 메시지 수신 사용자 이벤트(AI-chat-message)
            socket.on('AI-chat-message', (msg) => {

                // 진단 검사 결과 데이터
                const chatFeedbackData = msg;
                console.log(chatFeedbackData);

                if (chatFeedbackData.indexOf("change") !== -1) {
                    console.log("감성 챗봇 피드백:", chatFeedbackData);

                    // 데이터 parsing
                    const feedbackData = chatFeedbackData.split('@a');

                    // 진단 검사 결과 
                    console.log("오늘의 피드백:", feedbackData[1]);

                    // 진단 질의-응답 데이터
                    console.log("검사 질의-응답:", feedbackData[2]);

                    // 데이터 저장
                    savechatFeedbackData(chatFeedbackData);
                }

                else {
                    // 콜백 함수
                    setMessages((messages) => [...messages, { text: msg, type: 'received' }]);
                }

            });
        }

        //  클린업 함수가 실행(이벤트 리스너 해제 및 연결 종료)
        return () => {

            if (socket) {
                // 데이터 삭제
                console.log("Node.Js Server Disconnect");
                // 이벤트 리스너 해제
                socket.off('AI-chat-message');
                
                // 실제 소켓 연결을 종료합니다.
                socket.disconnect();
                setSocket(null);
            }
        };

    }, [socket]); // socket 상태를 의존성 배열에 추가: setSocket()을 사용하여 할당한다고 하더라도 즉시 할당되는 것은 아니므로
    //의존성 배열에 socket state를 설정하여socket state에 값이 설정되면 그때 실행되도록 설정


    //useEffect는 메시지 목록이 업데이트될 때마다 실행됩니다. 
    //이는 새 메시지가 도착할 때마다 채팅 화면을 자동으로 스크롤하여 최신 메시지를 보여주기 위함입니다.
    useEffect(() => {
        // 스크롤을 최하단으로 이동
        const messageList = document.querySelector('.message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]); // 메시지 목록이 업데이트될 때 실행

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {

        try {
            e.preventDefault();
            if (message) {
                if (socket) {
                    // 메세지 전송
                    socket.emit('AI-chat-message', message);
                    setMessages(messages => [...messages, { text: message, type: 'sent' }]);
                    setMessage('');
                }
            }
        }

        catch (e) {
            console.log(e);
        }
    };

    //상담 종료
    const EndChatCounsel = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        try {
            const ok = confirm("상담을 종료 하겠습니까?");
            const userId =user?.uid;
            if(ok)
                {
                    console.log("챗봇 종료");
                    if (socket) {
                        socket.emit('end chat',userId, callBack_setFeedbackSummary);

                        //Feedback summary data 로딩
                        setIsFeedbackAndSummary(true);
                    }
                }
          
        } catch (error) {
            console.log("채팅 종료 에러:", error);
        }
    }

    const savechatFeedbackData = async (chatFeedbackData: string) => {

        if (!user) return;

        // 데이터 파싱
        const parsingData = chatFeedbackData.split('@a');
        // 피드백 키워드 
        const feedbackData = parsingData[1];
        // 피드백 부가설명     
        const feedbackAddExplain = parsingData[2];


        //날짜 생성
        const date = new Date();

        try {
            // 데이터 저장
            const doc = await addDoc(collection(db, "chatbotFeedbacks"), {
                // tweet,// 게시판 내용 
                // Credential: Date.now(),//특정 시간부터 경과한 밀리초(millisecond 반환) 
                // // 작성자 유저 닉네임:, 유저 닉네임이 없으면 익명으로 저장 
                // username: user.displayName || "Anonymous",
                // //트윗을 삭제하고자 할 때 트윗을 삭제할 권한이 있는 유저를 구분
                // //트윗을 삭제하려는 유저의 ID와 여기 userID에 저장된 ID가 일치하는 확인 
                // userId: user.uid,

                // 진단 검사 결과 데이터

                // 사용자 ID 
                userID: user.uid,

                // 게시판 ID
                Credential: Date.now(),

                //날짜 
                ChatbotDate: (date.getFullYear() + "/" +
                    ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
                    ("0" + (date.getDate())).slice(-2) + "-" +
                    ("0" + (date.getHours())).slice(-2) + ":" +
                    ("0" + (date.getMinutes())).slice(-2) +
                    ":" + ("0" + (date.getSeconds())).slice(-2)),

                // 피드백 키워드 
                feedbackData,
                // 피드백 부가설명   
                feedbackAddExplain,

            });

            // 진단 결과 점수 
            setChatbotFeedback(feedbackData);

            //진단 결과 텍스트 
            setChatbotFeedbackExplain(feedbackAddExplain);

            // 모달 창 활성화
            setModal(true);
        }

        catch (e) {
            console.log("firebase error:", e);
        }

    }

    return (
        <>
        {/* 헤더 */}
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

                        {isFeedbackAndSummaryLoading === true? 
                                <Button color="primary" disabled>
                                <Spinner size="sm">
                                    Loading...
                                </Spinner>
                                <span>
                                    {' '}Loading
                                </span>
                                </Button>
                                :
                                <Button
                                color="primary"
                                href="#pablo"
                                onClick={EndChatCounsel}
                                disabled={isButton}
                                size="lm"
                                >
                                상담 종료
                                </Button>
                            }

                           
                        </Col>
                        </Row>
                    </CardHeader>

                    <>
                    {counselFeedback&& <ChatbotFeedback feedbackData= {counselFeedback} summaryData={counselSummary} /> }
                    </>

                    <CardBody>

                        <div>
                            {topic}
                        </div>

                        {/* 챗봇 컴포넌트 */}
                        <div className="App">
                        <div className="chat-container">
                            <ul className="message-list">
                                {/* messages 배열을 순회하면서 각 메시지를 출력합니다. map 함수는 msg와 index를 받아 JSX 요소를 반환합니다. */}
                                {messages.map((msg, index) => (
                                    <li key={index} className="message-item">
                                        {msg.type === 'received' && <img src={ProfileImageChatbot} alt="Receiver Profile" className="profile-pic " />}

                                        <div className={msg.type === 'received' ? 'message received' : 'message sent'}>


                                            {/* 텍스트 출력 AI 챗봇이 얘기할 때만 애니메이션 구현 */}
                                            {msg.type === 'received' && <TypingEffect key={index} anymation_text={msg.text} speed={20} />}

                                            {msg.type === 'sent' && (ProfileImageUser ? <img src={ProfileImageUser} alt="Sender Profile" className="profile-pic" /> :
                                            <svg className="profile-pic" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>)}
                                            
                                            {msg.type === 'sent' && <span className="message-content">{msg.text}</span>}

                                            {/* TypingEffect */}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <form onSubmit={sendMessage} className="send-form" >

                                <input type="text" value={message} disabled={isButton} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." required />
                               
                                <button type="submit" disabled={isButton} >Send</button>
                            </form>
                        </div>
                    </div>
                    </CardBody>
                    </Card>
            </Container>
        </>
    )
}
