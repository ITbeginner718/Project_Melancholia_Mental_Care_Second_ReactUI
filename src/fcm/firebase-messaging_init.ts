// 다음과 같이 호출했을 때 권한이 부여되면 토큰을 반환하고 거부되면 프로미스를 거부합니다.

import { useNavigate } from "react-router-dom";
import { messaging } from "../firebase";
import { getToken, onMessage, getMessaging} from "firebase/messaging";


// export 라고 하면 에러 
// export default function requestPermission() {

//     console.log('Requesting permission...');

//     // 알림 설정
//     // 앱 인스턴스의 현재 등록 토큰을 가져와야 한다면
//     // Notification.requestPermission()을 사용해 사용자에게 알림 권한을 요청 
//     Notification.requestPermission().then(async (permission) => {
//       if (permission === 'granted') {
//         console.log('Notification permission granted.토큰 발급');
//         // 만약 허용을 해주면 토큰 값 가져오기 
//         await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_CLOUD_MESSAGING_API_VAPID_KEY}).then((currentToken) => {
//             if (currentToken) {
//                 console.log(`푸시 토큰 발급 완료 : ${currentToken}`)
//                 // 토큰 리턴
//                 return currentToken;    
               
//             } else {
//                 // Show permission request UI
//                 console.log('No registration token available. Request permission to generate one.');
//                 console.log('푸시 권한 차단')
//                 return null;  
//                 // ...
//             }
//             }).catch((err) => {
//             console.log('An error occurred while retrieving token. ', err);
//             return null;
//             // ...
//             });
//     }
//     })
//     ;}

// requestPermission 함수를 async로 선언하고, Promise를 반환하도록 수정
export default async function requestPermission() {
    console.log('Requesting permission...');

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        console.log('Notification permission granted. 토큰 발급');
        try {
            // Promise
            const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_CLOUD_MESSAGING_API_VAPID_KEY });
            if (currentToken) {
                console.log(`푸시 토큰 발급 완료 : ${currentToken}`);
                return currentToken;
            } else {
                console.log('No registration token available. Request permission to generate one.');
                console.log('푸시 권한 차단');
                return null;
            }
        } catch (err) {
            console.log('An error occurred while retrieving token. ', err);
            return null;
        }
    }
    return null;
}

// foreground 앱 실행중 일 때 푸시 메시지 받기
//  const messaging = getMessaging(app); 
// getMessaging()을 app 인자를 주고 호출하면 에러 발생 

const messagingForeground = getMessaging();

// forground 이미지 받기
onMessage(messagingForeground, (payload) => {

  console.log('foregroundMessage', payload);

  if(payload.notification)
    {
      const notificationTitle = payload.notification.title
      const notificationOptions = {
        body: payload.notification.body,
      }
      
      if(notificationTitle)
        {
          const notification = new Notification(
            `${notificationTitle}(foreground)`,
            notificationOptions,
          );

          
          notification.onclick = function (event) {
            event.preventDefault()

            const regex = /[^0-9]/g;
            const id = notificationTitle.replace(regex,""); 
            
            console.log('notification clicked!')

            window.location.assign(
                `https://localhost:5173/admin/notification/${id}`
              );

            notification.close()
          }
        }
    }
});


