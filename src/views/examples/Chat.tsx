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
import React, { useEffect } from "react";

// reactstrap components
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

// core components
// 윗쪽 
import Header from "@components/Headers/Header";
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import Chatbot from "@components/ChatBot/chatbot";
import chatbotImage from "../../assets/img/theme/GraidentAiRobot.jpg";

const Chat = () => {
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
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Settings
                    </Button>
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                {/* 챗봇 컴포넌트 */}
                <Chatbot />
              </CardBody>
            </Card>
      </Container>
    </>
  );
};

export default Chat;
