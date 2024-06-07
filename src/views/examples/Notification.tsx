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
import React from "react";

// reactstrap components
import { Card, CardHeader, Col, Container, Row } from "reactstrap";

// core components
import Header from "../../components/Headers/Header.jsx";
import NotificationMessage from "../../components/notification/NotificationMessage.tsx";


const Notification = () => {
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
                {/* Table */}

                <Row>
                    <div className="col">
                        <Card className="shadow">

                            {/* 끝에 배치 */}
                            <CardHeader className="border-0">
                                <h3 className="mb-0">짧은 위로의 말</h3>

                                <Col style={{ borderBottom: "1px solid #CCC", margin: "10px 0" }}></Col>

                            </CardHeader>
                        </Card>
                    </div>
                </Row>
            </Container>

            <NotificationMessage/>
    </>
  );
};

export default Notification;
