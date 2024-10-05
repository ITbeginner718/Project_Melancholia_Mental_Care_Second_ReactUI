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
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Row, Form, Table, CardFooter, Pagination, PaginationItem, PaginationLink, ListGroup, ListGroupItem, Alert, ListGroupItemHeading, ListGroupItemText, CardText, CardTitle } from "reactstrap";

// core components
// 윗쪽 
import Header from "../Headers/Header.jsx";
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import chatbotImage from "../../assets/img/theme/GraidentAiRobot.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import useDidMountEffect from "@components/hooks/useDidMountEffect.js";


    interface SelectedItem {
        id: string;
        code: string;
    }

    interface IList
    {
    code:string;
    result:boolean;
    content:string;
    }


  const List=[
    {code:"A",result:true, content:`A항의 조건을 만족합니다.` },
    {code:"B",result:true, content:"B항의 조건을 만족합니다." },
    {code:"C",result:true, content:"C항의 조건을 만족합니다." },
    {code:"D",result:true, content:"D항의 조건을 만족합니다." },
    {code:"A",result:false, content:"A항의 조건을 만족하지 못합니다." },
    {code:"B",result:false, content:"B항의 조건을 만족하지 못합니다." },
    {code:"C",result:false, content:"C항의 조건을 만족하지 못합니다." },
    {code:"D",result:false, content:"D항의 조건을 만족하지 못합니다." }
  ]


export default function Result_Diagnose_DSM5() {

    // 현재 유저를 불러오기 
    const user = auth.currentUser;
    
    //스트링 쿼리 데이터 불러오기
    const location = useLocation();

    // const 무조건 넣주기
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);

    //진단 검사 결과 피드백 상태
    const [feedbackList, setFeedbackList] =useState<IList[]>([])

    //페이지 이동
    const navigate = useNavigate();


    //DSM 1차 진단 결과값 저장 
    const save_update_DSM5Result = async () => {

    //DSM 1차 진단 결과 데이터 불러오기 
        const tweetQuery = query(
            collection(db, "DiagnoseDSM5"),
            // 유저 ID가 같은 트윗들만 가져오기
            // profile.tsx:116 Uncaught (in promise) 
            // FirebaseError: The query requires an index
            // what the fucking index?
            /*
                => where("userId", "==", user?.uid), 
                이러한 필터 명령어를 firestore에 알려야 함
                오류에서 제공하는 url 사이트로 이동
                */
            where("userId", "==", user?.uid),
        );


    const snapshot = await getDocs(tweetQuery);
    const docData = snapshot.docs[0].data();
    const localIsSatisfied:Boolean = docData.isSatisfied;

    console.log("isSatisfied state_seconde" ,isSatisfied);
    console.log("firebase_Satisfied:" ,localIsSatisfied);

        //데이터가 없는 경우 데이터 삽입
        if (snapshot.empty) {
            console.log("데이터 비어있음, 새로 저장");

            //데이터 저장
            save_DSM5Result();
        }
        
        //데이터가 있는 경우 업데이트 처리
        else
        {   

            //서로 다른 값인 경우 데이터 저장
            const docRef = doc(db, "DiagnoseDSM5", snapshot.docs[0].id);

            if(localIsSatisfied!=isSatisfied)
            {

            console.log("isSatisfied state_third:",isSatisfied);
            // document 업데이트
            await updateDoc(docRef, {
                isSatisfied:isSatisfied
            });

            console.log("업데이트");
            }

            else
            {
                console.log("업데이트 안함:값이 같음");
            }
    
        }

    }

        

    //데이터 저장
    const save_DSM5Result = async () => {

        try {
            //데이터 베이스 신청 
            //컬레션을 지정(추가)해줘야 함 
            // *중요* 현재 데이터베이스는 테스트 용으로 30일 뒤에 삭제 
            // 생성된 document의 참조를 promise로 반환할 수 있음 

            const doc = await addDoc(collection(db, "DiagnoseDSM5"), {
                //트윗을 삭제하고자 할 때 트윗을 삭제할 권한이 있는 유저를 구분
                //트윗을 삭제하려는 유저의 ID와 여기 userID에 저장된 ID가 일치하는 확인 
                userId: user?.uid,
                isSatisfied
            });

        } catch (error) {
            console.log(error);
        } finally {
    
        }
        
    }

    // 스트링 쿼리 데이터 파싱
    const parseQueryString = () => {
        const searchParams = new URLSearchParams(location.search);
        const selectedItems: SelectedItem[] = [];
    
        searchParams.getAll('selected').forEach(item => {
          const [id, code] = item.split('!');
          console.log(id, code);
          if (id && code) {
            console.log(id, ",,", code);
            selectedItems.push({ id, code });
          }
        });
    
        setSelectedItems(selectedItems) ;
      };
    

      //진단 표 결과값 검사
    const checkConditions = () => {

    const feedbackResult: IList[] = [];


    // Code가 "A"인 항목 필터링
    const codeAItems = selectedItems.filter(item => item.code === "A");
    
    // Code가 "B"인 항목 필터링
    const codeBItems = selectedItems.filter(item => item.code === "B");

    // Code가 "C"인 항목 필터링
    const codeCItems = selectedItems.filter(item => item.code === "C");

    // Code가 "D"인 항목 필터링      
    const codeDItems = selectedItems.filter(item => item.code === "D");
    
    // 조건 1: Code가 "A"인 항목이 5개 이상이고 "questionA_01" 또는 "questionA_02"를 포함해야 함
    const condition1 = codeAItems.length >= 5 && 
        (codeAItems.some(item => item.id === "questionA_01") || 
        codeAItems.some(item => item.id === "questionA_02"));

    if (condition1) {
    const content = List.find(item => item.code === "A" && item.result === true);
    if (content !== undefined) {
        feedbackResult.push(content);
    }
    }
    else
    {
        const content = List.find(item => item.code === "A" && item.result === false);
        if (content !== undefined) {
        feedbackResult.push(content);
        }
    }

    // 조건 2: Code가 "B"인 항목이 포함되어 있어야 함
    const condition2 = codeBItems.length === 1; 

    if (condition2) {
        const content = List.find(item => item.code === "B" && item.result === true);
        if (content !== undefined) {
        feedbackResult.push(content);
        }
    }
        else
        {
        const content = List.find(item => item.code === "B" && item.result === false);
        if (content !== undefined) {
            feedbackResult.push(content);
        }
        }

    // 조건 3: Code가 "C"인 항목이 포함되어 있어야 함
    const condition3 = codeCItems.length === 1;
    if (condition3) {
    const content = List.find(item => item.code === "C" && item.result === true);
    if (content !== undefined) {
        feedbackResult.push(content);
    }
    }
    else
    {
        const content = List.find(item => item.code === "C" && item.result === false);
        if (content !== undefined) {
        feedbackResult.push(content);
        }
    }
    // 조건 4: Code가 "D"인 항목이 포함되어 있어야 함
    const condition4 = codeDItems.length === 1; 
    if (condition4) {
        const content = List.find(item => item.code === "D" && item.result === true);
        if (content !== undefined) {
        feedbackResult.push(content);
        }
    }
        else
        {
        const content = List.find(item => item.code === "D" && item.result === false);
        if (content !== undefined) {
            feedbackResult.push(content);
        }
        }
        setFeedbackList(feedbackResult);
    return condition1 && (condition2 && (condition3 && condition4)) ;
    };

useEffect(()=>{
        parseQueryString();
},[]);
    
    //useEffect를 firebase에 isSatisfied값이 true-false 무한반복으로
    //변경됨 그래서 useDidMountEffect사용 해야함
    useDidMountEffect(()=>{
        console.log("렌더링");
        //false
        setIsSatisfied(checkConditions());
    },[selectedItems]); 

    //검사 결과값 들어오면 firebase에 저장
    useDidMountEffect(()=>{
        console.log("이벤트 발생 isSatisfied state_first:", isSatisfied);
       save_update_DSM5Result();
    },[isSatisfied])
    

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

                    {/* ============================================================================================== */}

                    <Col className="order-xl-1" xl="8">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">우울증 진단검사 결과</h3>
                                    </Col>
                                    <Col className="text-right" xs="4"> 
                                    </Col>
                                </Row>
                            </CardHeader>

                            <CardBody>
                                {/* 검사표 결과 */}

                                <Card body>
                            <CardTitle tag="h5">
                                DSM5 진단 기준
                            </CardTitle>
                            <CardText>
                            <div> A. 다음 증상 가운데 1) 또는 2) 문항을 반드시 포함하여 5개(또는 그 이상) 증상이 연속 2주간 지속해야함 </div>
                            <div> B. A항의 증상이 사회적, 직업적, 또는 다른 중요한 기능 영역에서 임상적으로 현저한 고통이나 손상을 초래해야함</div>
                            <div> C. A항의 증상이 약물 복용이나 기타 질병에 의한 영향이 아님</div>
                            <div>  D. A항의 증상이 조현병 등 다른 정신질환에 의한 영향이 아님</div>
                            </CardText>
                        
                        </Card>

                        <div>
                        <Alert color="primary">
                
                        { isSatisfied ?(<span>조건이 만족합니다.</span>):(<span>조건이 불만족합니다..</span>) }
                        </Alert>
                     

                        <ListGroup>

                        {feedbackList.map((feedback)=>(
                            <>
                             <ListGroupItem>
                                <ListGroupItemHeading>
                                {feedback.code}조건:{(feedback.result)?"만족":"불만족"}
                                </ListGroupItemHeading>
                                <ListGroupItemText>
                                근거: {feedback.content}
                                </ListGroupItemText>
                            </ListGroupItem>
                        
                            </>
                            ))}

                        
                            
                        </ListGroup>
                        </div>
                       

                      
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};


