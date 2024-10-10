/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "./views/Index";
import Profile from "./views/examples/Profile.tsx";
import Maps from "./views/examples/Maps.jsx";
import Register from "./views/examples/Register.tsx";
import Login from "./views/examples/Login.tsx";
import Tables from "./views/examples/Tables.jsx";
import Icons from "./views/examples/Icons.jsx";
import Board from "./views/examples/Board.tsx";
import BoardDetail from "./components/Board/BoardDetail.tsx";
import Chat from "./views/examples/Chat.tsx";
import Diary from "./views/examples/Diary.tsx";
import DiaryDetail from "./components/Diary/DiaryDetail.tsx";
import MediaRecommad from "./views/examples/MediaRecommad.tsx";
import ChatDiagnose from "./views/examples/ChatDiagnose.tsx";
import DiagnoseDetail from "./components/ChatBotDiagnose/DiagnoseDetail.tsx";
import Notification from "./views/examples/Notification.tsx";
import Diagnose_DSM5 from "@components/DiagnoseTable/Diagnose_DSM5.tsx";
import Result_Diagnose_DSM5 from "@components/DiagnoseTable/Result_DSM5.tsx";
import Diagnose_BDI from "@components/DiagnoseTable/Diagnose_BDI.tsx";
import Result_Diagnose_BDI from "@components/DiagnoseTable/Result_DBI.tsx";

const routes = [
  {
    path: "/index",
    name: "메인페이지",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },

  {
    path: "/chatbot",
    name: "AI 챗봇",
    icon: "ni ni-chat-round text-info",
    component: <Chat />,
    layout: "/admin",
  },

  // 진단 검사
  {
    path: "/chatbot_diagnose",
    name: "AI 우울증 진단",
    icon: "ni ni-sound-wave text-pink",
    component: <ChatDiagnose />,
    layout: "/admin",
  },

  {
    path: "/board",
    name: "게시판 커뮤니티",
    icon: "ni ni-book-bookmark text-info",
    component: <Board />,
    layout: "/admin",
  },

  {
    path: "/diary",
    name: "감정 일기",
    icon: "ni ni-collection text-orange",
    component: <Diary />,
    layout: "/admin",
  },

  {
    path: "/user-profile",
    name: "나의 프로필",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },

  {
    path: "/mediarecommand/:id",
    name: "Anonymous",
    component: <MediaRecommad />,
    layout: "/admin",
  },

  {
    path: "/diary/detail/:id",
    name: "Anonymous",
    component: <DiaryDetail />,
    layout: "/admin",
  },

  {
    path: "/board/detail/:id",
    name: "Anonymous",
    component: <BoardDetail />,
    layout: "/admin",
  },

  {
    path: "/notification/:id",
    name: "Anonymous", 
    component: <Notification />,
    layout: "/admin",
  },

  // 진단 검사 상세 페이지 
  {
    path: "/diagnose/detail/:id",
    name: "Anonymous",
    component: <DiagnoseDetail />,
    layout: "/admin",
  },

  //DSM-5 검사
  {
    path: "/Diagnose_DSM5",
    name: "Anonymous",
    component: <Diagnose_DSM5 />,
    layout: "/admin",
  },

  //DSM-5 검사 결과
  {
    path: "/Diagnose_DSM5/result",
    name: "Anonymous",
    component: <Result_Diagnose_DSM5 />,
    layout: "/admin",
  },

   //Diagnose_BDI 검사
   {
    path: "/Diagnose_BDI",
    name: "Anonymous",
    component: <Diagnose_BDI />,
    layout: "/admin",
  },

 //Diagnose_BDI 검사
  
  {
    path: "/Diagnose_DBI/result/:DBI_content_id/:DBI_keyword_id",
    name: "Anonymous",
    component: <Result_Diagnose_BDI />,
    layout: "/admin",
  },


  {
    path: "/icons",
    name: "Anonymous",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Anonymous",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },

 
  {
    path: "/tables",
    name: "Anonymous",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
  

  {
    path: "/login",
    name: "Anonymous",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },

  {
    path: "/register",
    name: "Anonymous",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },


];
export default routes;


