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
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Row, Form, Table, CardFooter, Pagination, PaginationItem, PaginationLink, ListGroup, ListGroupItem, Alert, CardText, CardTitle, Badge } from "reactstrap";

// core components
// 윗쪽 
import Header from "../Headers/Header.jsx";
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import chatbotImage from "../../assets/img/theme/GraidentAiRobot.jpg";
import { useNavigate } from "react-router-dom";
import DSM5CheckBox from "@components/DiagnoseTable/DSM5_CheckBox";
import DSM5_B_Section from "./DSM5_B_Section.js";


// 체크박스 속성 타입 설정
export interface CheckedItem {
    id: string;
    code: string;
    question: string;

}

export default function Diagnose_DSM5() {

    // DSM5_List 리스트 가져오기
    const [DSM5_LIST, setDSM5_LIST] = useState<CheckedItem[]>([]);

    // 선택된 함목 가져오기
    const [checkedList, setCheckedList] = useState<CheckedItem[]>([]);

    //페이지 이동
    const navigate = useNavigate();

    //나중에 꼭 주석 풀어야 함
    //페이지 이동 시 
    useEffect(() => {
    // 페이지를 떠나기 전에 확인 요청
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        const message = "정말 이 페이지를 떠나시겠습니까? 페이지를 떠나면 검사 기록은 저장되지 않습니다.";
        e.returnValue = message; // Chrome에서 필요
        return message; // 다른 브라우저에서 필요
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };}, []); // 빈 의존성 배열을 사용해서 컴포넌트 마운트 시에만 이벤트 리스너를 추가하고, 언마운트 시에 제거


    // 리스트 가져오기
    useEffect(() => {
        const fetchDSM5List = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_DSM5_LIST_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: CheckedItem[] = await response.json();
                setDSM5_LIST(data);
            } catch (error) {
                console.error('Error fetching DSM5_LIST:', error);
            }
        };

        fetchDSM5List();
    }, []);

    // A항
    const questionA = DSM5_LIST.filter(data => data.code == "A");
    // B항
    const questionB = DSM5_LIST.filter(data => data.code == "B");
    // C항
    const questionC = DSM5_LIST.filter(data => data.code == "C");
    // D항
    const questionD = DSM5_LIST.filter(data => data.code == "D");

    // 체크 박스 선택 이벤트 (useCallback)
    const onCheckedItem = useCallback(
        (checked: boolean, item: CheckedItem) => {
            if (checked) {
                // 가장 뒷쪽에 추가
                setCheckedList((prev) => [...prev, item]);
            } else if (!checked) {
                // 삭제
                setCheckedList(checkedList.filter((el) => el.id !== item.id));
            }
        },
        [checkedList]
    );

    // 버튼 클릭시 결과 창으로 데이터 이동
    const onClickCheckBox = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        e.preventDefault();

        const ok = confirm("DSM5 검사 결과를 제출 하겠습니까?");

        if(ok)
        {
            checkedList.map((item) => (
                console.log(item, "= item.id:", item.id, "item.question:", item.question, item.code)
            ))
            
    
            // 페이지 이동
            // 선택된 항목들의 ID를 쿼리 스트링으로 변환
            const queryString = checkedList
                .map(item => `selected=${encodeURIComponent(item.id)}!${encodeURIComponent(item.code)}`)
                .join('&');
    
            navigate(`/admin/Diagnose_DSM5/result?${queryString}`);;
        }

       
    }

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
                                                <h3 className="mb-0">DSM-5 검사(1차)</h3>
                                            </Col>
                                            <Col className="text-right" xs="4">
                                                <Button
                                                    color="primary"
                                                    href="#pablo"
                                                    onClick={onClickCheckBox}
                                                    size="=lm"
                                                >  DSM-5 검사 설문지 제출
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardHeader>

                                    <CardBody>

                                    <ListGroup>
                                    <Card body>
                                    <CardTitle tag="h2">
                                    A항 입니다. 
                                    </CardTitle>
                                    <CardText>
                                    <h3>해당 리스트에서<span style={{color:"#ff0000"}}> 연속 2주 이상</span> 지속되는 항목들을 선택해주세요. </h3>
                                    </CardText>
                                    </Card>
                                    {/* 검사표 삽입 */}
                                    {questionA.map((list) => (
                                           <ListGroupItem>
                                    <DSM5CheckBox
                                    key={list.id}
                                    {...list}
                                    onCheckedItem={onCheckedItem}/>
                                    </ListGroupItem>
                                    ))}

                                    <br />
                                    <Card body>
                                    <CardTitle tag="h2">
                                    B항 입니다. 
                                    </CardTitle>
                                    <CardText>
                                    <h3>A항에서 선택한 증상들이 일상 생활에 직접적으로 영향을 끼치고 경제적 생활을 하면서 정신적 고통을
                                        느끼고 있거나, 일을 할 수 없는 상태이면 체크해주세요. </h3>
                                    </CardText>
                                    </Card>

                                    {questionB.map((list) => (
                                         <ListGroupItem>
                                            <DSM5CheckBox
                                         key={list.id}
                                         {...list}
                                         onCheckedItem={onCheckedItem}/>
                                     </ListGroupItem>
                                        
                                    ))}

                                    <br />
                                   <Card body>
                                    <CardTitle tag="h2">
                                    C항 입니다. 
                                    </CardTitle>

                                    <CardText>
                                    우울증을 유발하는 대표적인 약물, 질병입니다. 꼭 확인 후 체크 여부를 결정하세요. 
                                    <div>
                                    <DSM5_B_Section/>
                                    </div>
                             
                                    </CardText>

                                    <CardText>
                                    <h3>A항에서 선택한 증상들이 우울증을 유발하는 어떤 약물을 먹고난 이후에 발현이 되었거나,
                                        기타 다른 질병을 앓고난 이후에 증상이 <span style={{color:"#ff0000"}}> 나타난 것이 아니라면 체크해주세요.</span></h3>

                                    </CardText>
                                    </Card>
                                    {questionC.map((list) => (
                                           <ListGroupItem>
                                        <DSM5CheckBox
                                            key={list.id}
                                            {...list}
                                            onCheckedItem={onCheckedItem}
                                        />
                                        </ListGroupItem>
                                    ))}

                                    <br />
                                    <Card body>
                                    <CardTitle tag="h2">
                                    D항 입니다. 
                                    </CardTitle>
                                    <CardText>
                                    <h3>A항에서 선택한 증상들이 다른 정신 질환에 의해 <span style={{color:"#ff0000"}}>영향을 받은 것이 아니라면 체크해주세요.</span> </h3>
                                    </CardText>
                                    </Card>
                                    {questionD.map((list) => (
                                         <ListGroupItem>
                                        <DSM5CheckBox
                                            key={list.id}
                                            {...list}
                                            onCheckedItem={onCheckedItem}
                                        />
                                        </ListGroupItem>
                                    ))}

                                    </ListGroup>

                                    </CardBody>
                                </Card>
                                <br/>
                                <Button
                                color="primary"
                                href="#pablo"
                                onClick={onClickCheckBox}
                                size="=lm"
                            >  DSM-5 검사 설문지 제출
                            </Button>
                            </CardBody>
   
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};


