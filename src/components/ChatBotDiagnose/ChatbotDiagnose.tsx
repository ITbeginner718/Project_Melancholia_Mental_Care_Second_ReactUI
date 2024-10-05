
// core components
// 윗쪽 
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection } from 'firebase/firestore';
import ChatbotDiagnoseResult from './ChatbotDiagnoseResult';

// 프로필 이미지(챗봇)
import ProfileImageChatbot from "../../assets/img/theme/GraidentAiRobot.jpg";

// 메시지 타입 선언
type Messages = {
    text: string;
    type: 'received' | 'sent'; // 'type' 필드가 받을 수 있는 값으로 'received'와 'sent'로 제한
};


export default function Chatbot() {

    // 현재 유저를 불러오기 
    const user = auth.currentUser;

    //Socket io 
    const [socket, setSocket] = useState<Socket | null>(null);

    //Socket io FCM  
    const [socket_fcm, setSocket_fcm] = useState<Socket | null>(null);

    // 현재 입력 필드에 입력된 메세지 필드
    const [message, setMessage] = useState('');
    // 채팅 메시지 목록, 
    const [messages, setMessages] = useState<Messages[]>([]);
    const [userName, setUserName] = useState('');

    // 프로필 이미지(사용자)
    const ProfileImageUser = user?.photoURL;


    // 진단 결과(점수)
    // 현재 입력 필드에 입력된 메세지 필드
    const [diagnoseResultScore, setDiagnoseResultScore] = useState('');
    // 진단 결과(텍스트)    // 현재 입력 필드에 입력된 메세지 필드
    const [diagnoseResultText, setDiagnoseResultText] = useState('');

    // fcm으로 전송할 진단 결과(텍스트)    
    const [diagnoseResultText_fcm, setDiagnoseResultText_fcm] = useState('');


    // 모달 state
    const [modal, setModal] = useState(false);


    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {
        // 페이지를 벗어났다가 다시 들어오면 
        // 통신이 순식간에 disconnect 와 connect가 이루어진다.
        // 하지만 rasa에서는 disconnect가 바로 이루어지지 않고 시간이 좀 걸린다.
        // disconnect가 이루어지는 상황에서 connect를 요청하여 메세지가 오지 않게된다. 
        setTimeout(()=>{
      // 진단 검사 통신 
      const newSocket = io('http://localhost:4805');
      setSocket(newSocket);
        },5000)
  

        // FCM 통신
        const newSocket_FCM = io('http://localhost:4810');
        setSocket_fcm(newSocket_FCM);
    }, []);



    // 사용자 이름
    useEffect(() => {
        const userDisplayName = user?.displayName;

        if (userDisplayName) {
            setUserName(userDisplayName.replace(/\s/g, '_'));
        }

    }, []);


    function diagnoseResultTextMessage_fcm(ResultText: string) {
        let ResultText_fcm;
        if (ResultText === "양호") {
            ResultText_fcm = "최근에 실시간 AI 진단 검사에서 결과가 괜찮은 상태로 나왔어요! ";
        }

        if (ResultText === "보통") {
            ResultText_fcm = "최근에 실시간 AI 진단 검사에서 결과가 괜찮은 상태로 나왔어요! ";
        }

        if (ResultText === "경증") {
            ResultText_fcm = "최근에 실시간 AI 진단 검사에서 결과가 약간 우울감이 있는 상태로 나왔어요! ";
        }

        if (ResultText === "심각") {
            ResultText_fcm = "최근에 AI 진단 결과가 우울증 증상으로 의심되는 상태로 나왔네요. 우울증은 충분히 치료될 수 있는 병입니다. 전문가의 도움을 꼭 받아야 해요.";
        }

        return ResultText_fcm;
    }

        const sendFCM = () => {   

        const resutText_fcm = diagnoseResultTextMessage_fcm(diagnoseResultText_fcm);
        const message = `diagnose@a${resutText_fcm}`;
        
        console.log(message);
        // 처음 메시지 전송
        if (socket_fcm) {
            socket_fcm.emit('chat message', message);
            console.log("FCM Send");

            // setDiagnoseResultText_fcm(''); 

            // 모달 창 활성화
            // 소켓 통신까지 완벽하게 보낸 후에 모달창 활성화
            setModal(true);
        }

    }

    

    useEffect(() => {
        // socket 상태가 null이 아닐 때만 실행
        if (socket_fcm) {
         
            console.log("Node.Js Server Connect(FCM))");
            if (diagnoseResultText_fcm !== '') {
                sendFCM();
            }
        }

        //  클린업 함수가 실행(이벤트 리스너 해제 및 연결 종료)
        return () => {
            if (socket_fcm) {
                // 이벤트 리스너 해제
                socket_fcm.off('chat message');
                // 실제 소켓 연결을 종료합니다.
                socket_fcm.disconnect();
                setSocket_fcm(null);
                console.log("Node.Js Server Disconnect(FCM)");
            }
        };

    }, [diagnoseResultText_fcm]); // socket 상태를 의존성 배열에 추가: setSocket()을 사용하여 할당한다고 하더라도 즉시 할당되는 것은 아니므로
    //의존성 배열에 socket state를 설정하여socket state에 값이 설정되면 그때 실행되도록 설정


    useEffect(() => {
        // socket 상태가 null이 아닐 때만 실행
      
        if (socket) {
            // 처음 메시지 전송
            socket.emit('chat message', `진단 시작 ${userName}`);
            console.log("Node.Js Server Connect(Diagnose)");
        }

        if (socket) {
            // 메시지 수신
            socket.on('chat message', (msg) => {

                // 진단 검사 결과 데이터
                const diagnoseData = msg;

                if (diagnoseData.indexOf("result") !== -1) {
                    console.log("진단 결과 수신:", diagnoseData);

                    // 데이터 parsing
                    const resultData = diagnoseData.split('@a');

                    // 진단 검사 결과 
                    console.log("검사 결과:", resultData[1]);

                    // 진단 질의-응답 데이터
                    console.log("검사 질의-응답:", resultData[2]);

                    // 데이터 저장
                    saveDiagnoseData(diagnoseData);
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

                //disconnect 메세지 전송
                socket.emit('chat message', `진단검사중지`);

                // 이벤트 리스너 해제
                socket.off('chat message');
                // 실제 소켓 연결을 종료합니다.
                socket.disconnect();
                setSocket(null);

                console.log("Node.Js Server Disconnect");
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

    // ts: 매개변수 : type 설정
    const saveDiagnoseData = async (messageData: string) => {


        if (!user) return;

        // 데이터 파싱 ([0]:keyword: result, [1]: resultData, [2]: question-answer)
        const parsingData = messageData.split('@a');

        //====진단 검사 결과 데이터
        const parsingData2 = parsingData[1];

        const resultData = parsingData2.split('\n');

        //진단 검사 결과  점수
        const resultScore = resultData[0];

        //진단 검사 결과 텍스트 
        const resultText = resultData[1];

        // ====진단 질의-응답 데이터 
        const questionResponseData = parsingData[2];

        //날짜 생성
        const date = new Date();

        try {
            // 데이터 저장
            const doc = await addDoc(collection(db, "diagnoses"), {
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
                diagnoseDate: (date.getFullYear() + "/" +
                    ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
                    ("0" + (date.getDate())).slice(-2) + "-" +
                    ("0" + (date.getHours())).slice(-2) + ":" +
                    ("0" + (date.getMinutes())).slice(-2) +
                    ":" + ("0" + (date.getSeconds())).slice(-2)),

                // 진단 검사 결과(점수)
                resultScore,
                // 진단 검사 결과(텍스트)   
                resultText,
                // 질의 응답 데이터 
                questionResponseData
            });

            // 진단 결과 점수 
            setDiagnoseResultScore(resultScore);

            //진단 결과 텍스트 
            setDiagnoseResultText(resultText);

            // 진단 결과 텍스트 fcm으로 보낼 데이터 

            setDiagnoseResultText_fcm(resultText);
        }

        catch (e) {
            console.log("firebase error:", e);
        }

    }

    return (
        <>
            <h6 className="heading-small text-muted mb-4">
                User information
            </h6>
            {/* 밑선 */}
            <hr className="my-4" />

            <div className="App">
                <h1>마음이</h1>
                <div className="chat-container">
                    <ul className="message-list">
                        {messages.map((msg, index) => (
                            <li key={index} className="message-item">
                                <div className={msg.type === 'received' ? 'message received' : 'message sent'}>
                                    {msg.type === 'received' && <img src={ProfileImageChatbot} alt="Receiver Profile" className="profile-pic" />}

                                    {msg.type === 'sent' && (ProfileImageUser ? <img src={ProfileImageUser} alt="Sender Profile" className="profile-pic" /> :
                                        <svg className="profile-pic" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>)}
                                    <span className="message-content">{msg.text}</span>
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
            {modal ? <ChatbotDiagnoseResult userName={user?.displayName} resultScore={diagnoseResultScore} resultText={diagnoseResultText} /> : null}
        </>

    )
}
