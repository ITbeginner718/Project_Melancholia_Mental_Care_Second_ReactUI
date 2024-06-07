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
import React, { useEffect, useState } from "react";

// reactstrap components
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Row, Form } from "reactstrap";

// core components
// 윗쪽 
import Header from "../../components/Headers/Header.jsx";
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import Chatbot from "../../components/ChatBot/chatbot";
import ChatbotDiagnose from "../../components/ChatBotDiagnose/ChatbotDiagnose.tsx";
import chatbotImage from "../../assets/img/theme/GraidentAiRobot.jpg";

export default function ChatDiagnose () {
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
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={chatbotImage}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Connect
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Message
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    마음e
                    <span className="font-weight-light">, 27</span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    Bucharest, Romania
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    University of Computer Science
                  </div>
                  <hr className="my-4" />
                  <p>
                    Ryan — the name taken by Melbourne-raised, Brooklyn-based
                    Nick Murphy — writes, performs and records all of his own
                    music.
                  </p>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Show more
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* 챗봇 화면 */}
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">AI 우울증 진단검사</h3>
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
                <ChatbotDiagnose />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};


