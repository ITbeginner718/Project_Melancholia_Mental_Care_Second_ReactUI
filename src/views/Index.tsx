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
import { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)

// javascipt plugin for creating charts
import { Chart } from "chart.js";
import { io, Socket } from "socket.io-client";


// reactstrap components
import {
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,

} from "../variables/charts.jsx";

import Header from "../components/Headers/Header.jsx";
import requestPermission from "../fcm/firebase-messaging_init.ts";
import MainChatbotFeedback from "../components/Main/Main_chatbotFeedback.tsx";
import DiagnoseChart from "../components/Main/DiagnoseChart.tsx";
import PsychologicalCounseling from "../components/Main/PsychologicalCounseling.tsx";
import ArticleBlog from "../components/Main/ArticleBlog.tsx";

const Index = () => {

  //Socket io 
  const [socket, setSocket] = useState<Socket | null>(null);

  // toekn
  const [token, setToken] = useState<string | null>('');

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  //  소켓 통신 설정
  useEffect(() => {

    const newSocket = io('http://localhost:4810');
    setSocket(newSocket);

    // 토큰 값가져오기 
    fetchToken();

  }, []);


  useEffect(() => {

    console.log("socket UseEffect");
    
    if (socket) {
      // 메시지 수신
      socket.on('chat message', (msg) => {
      
        console.log(msg);
      });
    }

    //  클린업 함수가 실행(이벤트 리스너 해제 및 연결 종료)
    return () => {
      if (socket) {
        console.log("Node.Js FCM Server Disconnect");
        // 이벤트 리스너 해제
        socket.off('chat message');
        // 실제 소켓 연결을 종료합니다.
        socket.disconnect();
        setSocket(null);
      }
    };

  }, [socket]); // socket 상태를 의존성 배열에 추가: setSocket()을 사용하여 할당한다고 하더라도 즉시 할당되는 것은 아니므로
  //의존성 배열에 socket state를 설정하여socket state에 값이 설정되면 그때 실행되도록 설정

  // 웹푸시 알림 설정
  const fetchToken = async () => {
    const getToken = await requestPermission();

    setToken(getToken);
    console.log("토큰 받아오기 완료:", getToken);

  };

  // 토큰 전송
  useEffect(() => {

    if (token) {
      // 서버로 전송
      console.log("token: ", token);

      if (socket) {
        console.log("토큰 전송");
        const TOKEN = `token@a${token}`;
        // 서버로 토큰 전송
        socket.emit('chat message', TOKEN);
      }

    }

  }, [token])

  return (
    <>
      <Header />

      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            {/* 차트 가져오기 */}
            <DiagnoseChart />
          </Col>

          <Col xl="4">
            {/* 기사 블로그 가져오기 */}
            <ArticleBlog />
          </Col>

        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            {/* 심리 상담소 및 정신 건강 의학과 추천 */}
            <PsychologicalCounseling />

          </Col>

          <Col xl="4">
            {/* 챗봇 피드백 가져오기 */}
            <MainChatbotFeedback />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
