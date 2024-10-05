
// core components
// 윗쪽 
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection } from 'firebase/firestore';
import ChatbotFeedback from './ChatbotFeedback';
import ProfileImageChatbot from "../../assets/img/theme/GraidentAiRobot.jpg";

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


export default function Chatbot() {

    // 현재 유저를 불러오기 
    const user = auth.currentUser;

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


    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {
        const newSocket = io('http://localhost:4800');
        setSocket(newSocket);
    }, []);


    // 사용자 이름
    useEffect(() => {
        const userDisplayName = user?.displayName;

        if (userDisplayName) {
            setUserName(userDisplayName.replace(/\s/g, '_'));
        }

    }, []);


    useEffect(() => {
        // socket 상태가 null이 아닐 때만 실행
        if (socket) {
            console.log("Node.Js Server Connect");
            // 처음 메시지 전송
            socket.emit('chat message', `인지행동치료시작 ${userName}`);
        }

        if (socket) {
            // 메시지 수신
            socket.on('chat message', (msg) => {

                // 진단 검사 결과 데이터
                const chatFeedbackData = msg;

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
                console.log("Node.Js Server Disconnect");
                // 이벤트 리스너 해제
                socket.off('chat message');
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
                    socket.emit('chat message', message);
                    setMessages(messages => [...messages, { text: message, type: 'sent' }]);
                    setMessage('');
                }
            }
        }

        catch (e) {
            console.log(e);
        }
    };

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
                    <form onSubmit={sendMessage} className="send-form">
                        <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." required />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>


            {/*결과창*/}
            {modal ? <ChatbotFeedback feedbackData={chatbotFeedback} feedbackAddExplain={chatbotFeedbackExplain} /> : null}

        </>

    )
}
