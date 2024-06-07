
// import { getMessaging } from "firebase/messaging";
// =>SyntaxError: Cannot use import statement outside a module 

// /public/firebase-messaging-sw.js
importScripts(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

self.addEventListener("install", function (e) {
    self.skipWaiting();
});

self.addEventListener("activate", function (e) {
    console.log("fcm service worker가 실행되었습니다.");
});

firebase.initializeApp( {
    // api 키
    apiKey: import.meta.env.VITE_FIREBASE_INITIALIZE_API_KEY,
    authDomain: "project-mentalcare.firebaseapp.com",
    projectId: "project-mentalcare",
    storageBucket: "project-mentalcare.appspot.com",
    messagingSenderId: "349157902137",
    appId: "1:349157902137:web:053cf3b51f32885fc48ae8"
  });


//알 림설정 
const messaging = firebase.messaging();

// 백그라운드 알림 설정 
messaging.onBackgroundMessage((payload) => {
    // const notificationTitle = payload.title;
    // const notificationOptions = {
    //     body: payload.body
    //     // icon: payload.icon
    // };
    // self.registration.showNotification(notificationTitle, notificationOptions);
    console.log("onBackgroundMessage:", payload); 
    
});


