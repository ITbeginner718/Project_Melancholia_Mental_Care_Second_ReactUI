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
import React, { useCallback, useEffect, useMemo, useState } from "react";

// reactstrap components
import { Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Row, } from "reactstrap";

// core components
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import chatbotImage from "../../assets/img/theme/GraidentAiRobot.jpg";
import BDI_list from '../../../diagnose_list/BDI_list.json';
import RadioGroup from "./RadioGroup";
import Radio from "./Radio";
import { addDoc, collection } from "firebase/firestore";
import { auth,db } from "@/firebase";
import Header from "@components/Headers/Header";


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
    // 현재 유저를 불러오기 
    const user = auth.currentUser;

    //데이터 갖고 오기
    const BDI_Data: BDI_list = BDI_list;

    //선택된 데이터 저장
    const [selectedValues, setSelectedValues] = useState<SelectedValue[]>([]);

    const [DBI_Result, setDBI_Result]= useState(0);

    //날짜 생성
    const date = new Date();

    //검사 결과 score
    useEffect(() => {
        const totalLevel = sortedSelectedValues.reduce((sum, value) => sum + value.level, 0);
        setDBI_Result(totalLevel);
      }, [selectedValues]);
      
    //데이터가 선택될 때마다 데이터 정렬
    const sortedSelectedValues = useMemo(() => {
        return [...selectedValues].sort((a, b) => a.index - b.index);
    }, [selectedValues]);

    // const packageSelectedValues= (selectedValues: SelectedValue[]):string =>
    //     {
    //         return selectedValues.map(item => 
    //             `${item.index}|${item.category}|${item.name}|${item.level}|${item.content}`
    //           ).join('@');
    //     }


    //증상별 데이터 정렬
    const {
        // 감정 
        emotionalSymptoms,
        //인지
        cognitiveSymptoms,
        //동기(행동)
        motivationalSymptoms,
        //신체
        physicalSymptoms
    } = useMemo(() => {
        const emotional: SelectedValue[] = [];
        const cognitive: SelectedValue[] = [];
        const motivational: SelectedValue[] = [];
        const physical: SelectedValue[] = [];

        selectedValues.forEach(value => {
            if(value.level>=1)
            {
                switch (value.category) {
                    case "정서적 증상":
                        emotional.push(value);
                        break;
                    case "인지적 증상":
                        cognitive.push(value);
                        break;
                    case "동기적 증상":
                        motivational.push(value);
                        break;
                    case "신체적 증상":
                        physical.push(value);
                        break;
                }
            }

            else
            {
                console.log(`${value.category}, ${value.name}, ${value.content}, ${value.level}`);
            }
            
        });

        // 각 배열 내에서 level 기준으로 정렬
        const sortByLevel = (a: SelectedValue, b: SelectedValue) => b.level - a.level;

        return {
            emotionalSymptoms: emotional.sort(sortByLevel),
            cognitiveSymptoms: cognitive.sort(sortByLevel),
            motivationalSymptoms: motivational.sort(sortByLevel),
            physicalSymptoms: physical.sort(sortByLevel)
        };
    }, [selectedValues]);


    //DBI 검사 결과(content)
    const packageSelectedValues = useCallback((selectedValues: SelectedValue[]): string => {
        return selectedValues.map(item => 
            `${item.index}|${item.category}|${item.name}|${item.level}|${item.content}`
        ).join('@');
        }, []);

   //DBI 검사 결과 패키징(content)
    const DBIResultcontent = useMemo(() => packageSelectedValues(selectedValues), [selectedValues]);
    // const DBIResultcontent = packageSelectedValues(selectedValues);


    //=========================================================================증상별 분류(키워드)============================
    //DBI 검사 결과 정서적 증상(keyword, emotionalSymptoms)
    const packageEmotionalSymptoms = useCallback((selectedValues: SelectedValue[]): string => {
    return selectedValues.map(item => 
        `${item.category}|${item.name}|${item.level}`
    ).join('@');
    }, []);

   //DBI 검사 결과 정서적 증상 패키징(emotionalSymptoms)
    const DBIResultEmotionalSymptoms = useMemo(() => packageEmotionalSymptoms(emotionalSymptoms), [emotionalSymptoms]);


    //DBI 검사 결과 인지적 증상(keyword, cognitiveSymptoms)
    const packageCognitiveSymptoms = useCallback((selectedValues: SelectedValue[]): string => {
    return selectedValues.map(item => 
        `${item.category}|${item.name}|${item.level}`
    ).join('@');
    }, []);

    //DBI 검사 결과 인지적 증상 패키징(cognitiveSymptoms)
    const DBIResultCognitiveSymptoms = useMemo(() => packageCognitiveSymptoms(cognitiveSymptoms), [cognitiveSymptoms]);
    


    //DBI 검사 결과 동기적 증상(keyword, motivationalSymptoms)
    const packageMotivationalSymptoms = useCallback((selectedValues: SelectedValue[]): string => {
        return selectedValues.map(item => 
            `${item.category}|${item.name}|${item.level}`
        ).join('@');
        }, []);
    
    //DBI 검사 결과 동기적 증상 패키징(motivationalSymptoms)
    const DBIResultMotivationalSymptoms = useMemo(() => packageMotivationalSymptoms(motivationalSymptoms), [motivationalSymptoms]);


    //DBI 검사 결과 신체적 증상(keyword, physicalSymptoms)
    const packagePhysicalSymptoms = useCallback((selectedValues: SelectedValue[]): string => {
        return selectedValues.map(item => 
            `${item.category}|${item.name}|${item.level}`
        ).join('@');
        }, []);
    
    //DBI 검사 결과 신체적 증상 패키징(physicalSymptoms)
    const DBIResultPhysicalSymptoms = useMemo(() => packagePhysicalSymptoms(physicalSymptoms), [physicalSymptoms]);

    
    
    //DBI 검사 결과 저장(설문 내용) 
    const saveDBI_content= async()=>{
    
        if (!user) return;

        try {
            // 데이터 저장
            const doc = await addDoc(collection(db, "diagnoseBDIresult"), {
                // tweet,// 게시판 내용 
                // Credential: Date.now(),//특정 시간부터 경과한 밀리초(millisecond 반환) 
                // // 작성자 유저 닉네임:, 유저 닉네임이 없으면 익명으로 저장 
                // username: user.displayName || "Anonymous",
                // //트윗을 삭제하고자 할 때 트윗을 삭제할 권한이 있는 유저를 구분
                // //트윗을 삭제하려는 유저의 ID와 여기 userID에 저장된 ID가 일치하는 확인 
                // userId: user.uid,

                // 진단 검사 결과 데이터

                // 사용자 ID 
                userID: user.uid,

                // 게시판 ID
                Credential: Date.now(),

                //날짜 
                diagnoseDate: (date.getFullYear() + "/" +
                    ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
                    ("0" + (date.getDate())).slice(-2) + "-" +
                    ("0" + (date.getHours())).slice(-2) + ":" +
                    ("0" + (date.getMinutes())).slice(-2) +
                    ":" + ("0" + (date.getSeconds())).slice(-2)),

                //검사결과 리스트(text)
                DBIResultcontent,

                //검사결과 리스트(score)
                DBI_Result,
            });

            console.log(doc);

        }

        catch (e) {
            console.log("firebase error:", e);
        }

    }

    //DBI 검사 결과 저장(치료 키워드)
    const saveDBI_treatment= async()=>{
        if (!user) return;

        try {
            // 데이터 저장
            const doc = await addDoc(collection(db, "diagnoseBDIresult_treatment_keyword"), {
                // tweet,// 게시판 내용 
                // Credential: Date.now(),//특정 시간부터 경과한 밀리초(millisecond 반환) 
                // // 작성자 유저 닉네임:, 유저 닉네임이 없으면 익명으로 저장 
                // username: user.displayName || "Anonymous",
                // //트윗을 삭제하고자 할 때 트윗을 삭제할 권한이 있는 유저를 구분
                // //트윗을 삭제하려는 유저의 ID와 여기 userID에 저장된 ID가 일치하는 확인 
                // userId: user.uid,

                // 진단 검사 결과 데이터

                // 사용자 ID 
                userID: user.uid,

                // 게시판 ID
                Credential: Date.now(),

                //날짜 
                diagnoseDate: (date.getFullYear() + "/" +
                    ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
                    ("0" + (date.getDate())).slice(-2) + "-" +
                    ("0" + (date.getHours())).slice(-2) + ":" +
                    ("0" + (date.getMinutes())).slice(-2) +
                    ":" + ("0" + (date.getSeconds())).slice(-2)),

                //검사결과 키워드 추출 정서적(EmotionalSymptoms)
                DBIResultEmotionalSymptoms,

                //검사결과 키워드 추출 인지적(CognitiveSymptoms)
                DBIResultCognitiveSymptoms,
                
                //검사결과 키워드 추출 동기적(MotivationalSymptoms)
                DBIResultMotivationalSymptoms,

                //검사결과 키워드 추출 신체적(PhysicalSymptoms)
                DBIResultPhysicalSymptoms

            });

            console.log(doc);

        }


        catch (e) {
            console.log("firebase error:", e);
        }
    }
    //


    //라디오버튼 클릭시 데이터 저장
    const handleRadioChange = (value: SelectedValue) => {
        setSelectedValues(prev => {
            const newValues = prev.filter(item => item.name !== value.name);
            return [...newValues, value];
        });
    };

    //데이터 전송
     const onClick=(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>
     {
        e.preventDefault();
        //전부다 체크가 되었는지 확인해야 함

        if(selectedValues.length!==21)
        {
            alert("모두 체크를 해줘야 합니다.");
        }

        else
        {
            const ok = confirm("결과를 제출하겠습니까?");
            
            if(ok)
            {
                console.log("검사 결과 ================================================");
                //진단 검사 분류
                {sortedSelectedValues.forEach((value)=>{
                    console.log(`${value.category},${value.name}, ${value.content}, ${value.level} `)
                })}

                console.log(`총 score:${DBI_Result}`);
                
                console.log("정서적 증상 ================================================");
                {emotionalSymptoms.map((value)=>(
                    console.log(`${value.category},${value.name}, ${value.level} `)
                ))}
                console.log("인지적 증상 ================================================");
                {cognitiveSymptoms.map((value)=>(
                    console.log(`${value.category},${value.name}, ${value.level} `)
                ))}
                console.log("동기적 증상 ================================================");
                {motivationalSymptoms.map((value)=>(
                    console.log(`${value.category},${value.name}, ${value.level} `)
                ))}
                console.log("신체적 증상 ================================================");
                {physicalSymptoms.map((value)=>(
                    console.log(`${value.category},${value.name}, ${value.level} `)
                ))}
                
                //firebase 설문검사 저장
                saveDBI_content();

                //firebase 설문검사 키워드 별 저장
                saveDBI_treatment();
            }
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
                                                <h3 className="mb-0">BDI 검사(2차)</h3>
                                            </Col>
                                            <Col className="text-right" xs="4">
                                                <Button
                                                    color="primary"
                                                    href="#pablo"
                                                    onClick={onClick}
                                                    size="=lm"
                                                >  DSM-5 검사 결과 버튼
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardHeader>

                                    <CardBody>

                                 
                    {BDI_Data.symptoms.map((symptom: Symptom) => (
                            <>
                            {symptom.details.map((detail: Detail, dIndex: number) => (
                                <>
                              <br/>
                                <div key={dIndex}>
                                     {/* 세부 증상: 슬픔, 울음, 분노 */}
                                            <ListGroup numbered>
                                            <RadioGroup 
                                                label={detail.name} 
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                console.log(event.target.value);
                                                const [index,category, name, level, content] = event.target.value.split('|');
                                                
                                                handleRadioChange({
                                                    index:parseInt(index),
                                                    category,
                                                    name,
                                                    level: parseInt(level),
                                                    content
                                                });

                                                }}
                                            >
                                                {detail.description.map((desc: Description, index: number) => (
                                                     <ListGroupItem>
                                               
                                                    <Radio 
                                                    category={symptom.category} 
                                                    name={detail.name} 
                                                    level={desc.level} 
                                                    content={desc.content} 
                                                    index={detail.index}
                                                    >
                                                    {desc.content}
                                                    </Radio>
                                             
                                                    </ListGroupItem>
                                                ))}
                                            </RadioGroup>
                                            </ListGroup>
                                            
                                        </div>
                                        </>
                                    ))}
                               </>
                            ))}
                            <div>
                                <br/>
                            <Button
                                    color="primary"
                                    href="#pablo"
                                    onClick={onClick}
                                    size="=lm"
                                >  DSM-5 검사 결과 버튼 </Button>
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


