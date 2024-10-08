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
import React, { useCallback, useEffect, useState } from "react";

// reactstrap components
import { Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Row, } from "reactstrap";

// core components
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import chatbotImage from "../../assets/img/theme/GraidentAiRobot.jpg";
import BDI_list from '../../../diagnose_list/BDI_list.json';
import RadioGroup from "./RadioGroup";
import Radio from "./Radio";



interface Description {
    level: number;
    content: string;
}

interface Detail {
    index:number;
    name: string;
    description: Description[];
}

interface Symptom {
    category: string;
    details: Detail[];
}

interface BDI_list {
    symptoms: Symptom[];
}

interface SelectedValue {
    index:number;
    category: string;
    name: string;
    level: number;
    content: string;
}
export default function Diagnose_BDI() {

    //데이터 갖고 오기
    const BDI_Data: BDI_list = BDI_list;

    //선택된 데이터 저장
    const [selectedValues, setSelectedValues] = useState<SelectedValue[]>([]);

    const [DBI_Result, setDBI_Result]= useState(0);

    return (
        <>
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

                    <Col className="order-xl-1" xl="8">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">우울증 진단검사</h3>
                                    </Col>
                                    <Col className="text-right" xs="4"> 
                                    </Col>
                                </Row>
                            </CardHeader>

                            <CardBody>
                                {/* 검사표 삽입 */}
                                <Card className="bg-secondary shadow">
                                    <CardHeader className="bg-white border-0">
                                        <Row className="align-items-center">
                                            <Col xs="8">
                                                <h3 className="mb-0">BDI 검사(2차)</h3>
                                            </Col>
                                            <Col className="text-right" xs="4">
                                                <Button
                                                    color="primary"
                                                    href="#pablo"
                                                    // onClick={onClickCheckBox}
                                                    size="=lm"
                                                >  DSM-5 검사 결과 버튼
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardHeader>

                                    <CardBody>
                                    <div>
                    {BDI_Data.symptoms.map((symptom: Symptom, sIndex: number) => (

                        <div key={sIndex}>
                            {/*정서적, 인지적 등등 증상 */}

                            {symptom.details.map((detail: Detail, dIndex: number) => (
                                <div key={dIndex}>
                                     {/* 세부 증상: 슬픔, 울음, 분노 */}
                                            <ul>
                                            <RadioGroup 
                                                label={detail.name} 
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                console.log(event.target.value);
                                                const [index,category, name, level, content] = event.target.value.split('|');
                                                
                                                // handleRadioChange({
                                                //     index:parseInt(index),
                                                //     category,
                                                //     name,
                                                //     level: parseInt(level),
                                                //     content
                                                // });
                                                
                                                }}
                                            >
                                                {detail.description.map((desc: Description, index: number) => (
                                                <div key={index}>
                                                    <Radio 
                                                    category={symptom.category} 
                                                    name={detail.name} 
                                                    level={desc.level} 
                                                    content={desc.content} 
                                                    index={detail.index}
                                                    >
                                                    {desc.content}
                                                    </Radio>
                                                </div>
                                                ))}
                                            </RadioGroup>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>  
                                    </CardBody>
                                </Card>
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};


