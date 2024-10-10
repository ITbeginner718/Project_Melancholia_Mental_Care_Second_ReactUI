
import React, { useCallback, useEffect, useMemo, useState } from "react";

// reactstrap components
import { Alert, Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Row, } from "reactstrap";

// core components
import '../../assets/css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일
import chatbotImage from "../../assets/img/theme/GraidentAiRobot.jpg";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth,db } from "@/firebase";
import Header from "@components/Headers/Header";
import { useNavigate, useParams } from "react-router-dom";
import { SelectedValue } from "./Diagnose_BDI";
import useDidMountEffect from "@components/hooks/useDidMountEffect";

interface DBIResultContent
{
    DBIResultcontent:string;
    DBI_Result:number;
}

interface ISympotoms
{
    DBIResultCognitiveSymptoms:string;
    DBIResultEmotionalSymptoms:string;
    DBIResultMotivationalSymptoms:string;
    DBIResultPhysicalSymptoms:string;
}

interface DBIResultContentSurvey
{
    category: string;
    name: string;
    level: string;
    content?: string;
}

export default function Result_Diagnose_BDI() {
    // 현재 유저를 불러오기 
    const user = auth.currentUser;

    //데이터 저장(content object)
    const [Object_DBI_resultValuesContent, Object_setDBI_resultValuesContent] = useState<DBIResultContent>();

    //데이터 저장 (content BDI survey data)
    const [DBI_surveyData, setDBI_surveyData] = useState<string>();

    const [DBI_resultScore, setDBI_resultScore]=useState<number>()

    const [DBI_surveyDataParsing, setDBI_surveyDataParsing] =useState<DBIResultContentSurvey[]>([]);


    //데이터 저장 (keyword BDI survey data)
    const [Object_DBI_resultValuesKeyword, setObject_DBI_resultValuesKeyword] = useState<ISympotoms>();
    
    const[DBI_Symptoms_Cognitive, setDBI_Symptoms_Cognitive] =useState<string>();
    const[DBI_Symptoms_Emotional, setDBI_Symptoms_Emotional] =useState<string>();
    const[DBI_Symptoms_Motivational, setDBI_Symptoms_Motivational] =useState<string>();
    const[DBI_Symptoms_Physical, setDBI_Symptoms_Physical] =useState<string>();


    const [DBI_SymptomsCognitiveDataParsing, setDBI_SymptomsCognitiveDataParsing] =useState<DBIResultContentSurvey[]>([]);
    const [DBI_SymptomsEmotionalDataParsing, setDBI_SymptomsEmotionalDataParsing] =useState<DBIResultContentSurvey[]>([]);
    const [DBI_SymptomsMotivationalDataParsing, setDBI_SymptomsMotivationalDataParsing] =useState<DBIResultContentSurvey[]>([]);
    const [DBI_SymptomsPhysicalDataParsing, setDBI_SymptomsPhysicalDataParsing] =useState<DBIResultContentSurvey[]>([]);
    
    //페이지 이동
    const navigate = useNavigate();

    // 게시판 정보 id값 가져오기
    const { DBI_content_id, DBI_keyword_id } = useParams();

    console.log(DBI_content_id, " ,", DBI_keyword_id)
    
    //DBI 검사 결과(content) 갖고 오기
    const load_DBI_Result_content= async()=>{
        if (!user) return;

        //load_DBI_Result_content 값 불러오기
        
         //타입이 string인지 체크
      if (typeof DBI_content_id === "string") {
        // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
        const docRef = doc(db, "diagnoseBDIresult", DBI_content_id);

        // 참조를 사용하여 문서 정보 가져오기
        const docSnap = await getDoc(docRef);

        //해당 쿼리에 대한 모든 문서 반환 
        if (docSnap.exists()) {
        const doc_BDI_Result = () => {

            const { DBIResultcontent, DBI_Result } = docSnap.data();

            return { DBIResultcontent, DBI_Result }
        }
        Object_setDBI_resultValuesContent(doc_BDI_Result);
        }
   }
   }

      //DBI 검사 결과(keyword) 갖고 오기
      const load_DBI_Result_keyword= async()=>{
        if (!user) return;

        //load_DBI_Result_keyword 값 불러오기
        
         //타입이 string인지 체크
      if (typeof DBI_keyword_id === "string") {
        // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
        const docRef = doc(db, "diagnoseBDIresult_treatment_keyword", DBI_keyword_id);

        // 참조를 사용하여 문서 정보 가져오기
        const docSnap = await getDoc(docRef);

        //해당 쿼리에 대한 모든 문서 반환 
        if (docSnap.exists()) {
        const doc_BDI_Result = () => {

            const { DBIResultCognitiveSymptoms, DBIResultEmotionalSymptoms,DBIResultMotivationalSymptoms,DBIResultPhysicalSymptoms } = docSnap.data();

            return { DBIResultCognitiveSymptoms, DBIResultEmotionalSymptoms,DBIResultMotivationalSymptoms,DBIResultPhysicalSymptoms }
        }

        setObject_DBI_resultValuesKeyword(doc_BDI_Result);
        }
   }
   }

   //content, keyword 불러오기
   useEffect(()=>{
    //content
    load_DBI_Result_content();
    load_DBI_Result_keyword();
   },[])

   //DBI_resultContent content, score 값 저장
   useDidMountEffect(()=>{
    console.log("Object_DBI_resultValuesContent 렌더링");

    if (typeof Object_DBI_resultValuesContent?.DBIResultcontent === "string") {
        setDBI_surveyData(Object_DBI_resultValuesContent?.DBIResultcontent);
    }

    if (typeof Object_DBI_resultValuesContent?.DBI_Result === "number") {
        setDBI_resultScore(Object_DBI_resultValuesContent?.DBI_Result);
    }

},[Object_DBI_resultValuesContent])

    //DBI_resultContent parsing
    useDidMountEffect(()=>{
        console.log("Object_DBI_resultValuesContent 파싱");

        if (DBI_surveyData) {
            // 데이터 파싱
            const DBI_surveyDataParsing = DBI_surveyData.split('@');

            const DBI_contentData = DBI_surveyDataParsing.map((data) => {
                const parsingData = data.split('|');
 
                console.log("응답-데이터 파싱")
                return {
                    category: parsingData[1],
                    name: parsingData[2],
                    level: parsingData[3],
                    content: parsingData[4],
                }
            });

            setDBI_surveyDataParsing(DBI_contentData);
        }

    },[DBI_surveyData])

  //DBI_resultKeyword  
  //DBIResultCognitiveSymptoms,DBIResultEmotionalSymptoms,DBIResultMotivationalSymptoms,DBIResultPhysicalSymptoms 값 저장
  useDidMountEffect(()=>{
    console.log("Object_DBI_resultValuesKeyword 렌더링");

    if (typeof Object_DBI_resultValuesKeyword?.DBIResultCognitiveSymptoms === "string") {
        setDBI_Symptoms_Cognitive(Object_DBI_resultValuesKeyword?.DBIResultCognitiveSymptoms);
    }
    if (typeof Object_DBI_resultValuesKeyword?.DBIResultEmotionalSymptoms === "string") {
        setDBI_Symptoms_Emotional(Object_DBI_resultValuesKeyword?.DBIResultEmotionalSymptoms);
    }
    if (typeof Object_DBI_resultValuesKeyword?.DBIResultMotivationalSymptoms === "string") {
        setDBI_Symptoms_Motivational(Object_DBI_resultValuesKeyword?.DBIResultMotivationalSymptoms);
    }
    if (typeof Object_DBI_resultValuesKeyword?.DBIResultPhysicalSymptoms === "string") {
        setDBI_Symptoms_Physical(Object_DBI_resultValuesKeyword?.DBIResultPhysicalSymptoms);
    }
    },[Object_DBI_resultValuesKeyword])
 

      //DBI_resultkeyword(Cognitive,Emotional,Motivational,Physical) parsing
      useDidMountEffect(()=>{
        console.log("Object_DBI_resultValuesKeyword 파싱");

        if (DBI_Symptoms_Cognitive) {
            // 데이터 파싱
            const DBI_surveyDataParsing = DBI_Symptoms_Cognitive.split('@');

            const DBI_cognitiveKeywordtData = DBI_surveyDataParsing.map((data) => {
                const parsingData = data.split('|');
 
                console.log("DBI_surveyDataParsing 파싱")
                return {
                    category: parsingData[0],
                    name: parsingData[1],
                    level: parsingData[2],
                }
            });

            setDBI_SymptomsCognitiveDataParsing(DBI_cognitiveKeywordtData);
        }


        if (DBI_Symptoms_Emotional) {
            // 데이터 파싱
            const DBI_surveyDataParsing = DBI_Symptoms_Emotional.split('@');

            const DBI_emotionalKeywordtData = DBI_surveyDataParsing.map((data) => {
                const parsingData = data.split('|');
 
                console.log("DBI_surveyDataParsing 파싱")
                return {
                    category: parsingData[0],
                    name: parsingData[1],
                    level: parsingData[2],
                }
            });

            setDBI_SymptomsEmotionalDataParsing(DBI_emotionalKeywordtData);
        }


        if (DBI_Symptoms_Motivational) {
            // 데이터 파싱
            const DBI_surveyDataParsing = DBI_Symptoms_Motivational.split('@');

            const DBI_motivationalKeywordtData = DBI_surveyDataParsing.map((data) => {
                const parsingData = data.split('|');
 
                console.log("DBI_surveyDataParsing 파싱")
                return {
                    category: parsingData[0],
                    name: parsingData[1],
                    level: parsingData[2],
                }
            });

            setDBI_SymptomsMotivationalDataParsing(DBI_motivationalKeywordtData);
        }

        console.log("Object_DBI_resultValuesKeyword 파싱");

        if (DBI_Symptoms_Physical) {
            // 데이터 파싱
            const DBI_surveyDataParsing = DBI_Symptoms_Physical.split('@');

            const DBI_physicalKeywordtData = DBI_surveyDataParsing.map((data) => {
                const parsingData = data.split('|');
 
                console.log("DBI_surveyDataParsing 파싱")
                return {
                    category: parsingData[0],
                    name: parsingData[1],
                    level: parsingData[2],
                }
            });

            setDBI_SymptomsPhysicalDataParsing(DBI_physicalKeywordtData);
        }

    },[DBI_Symptoms_Cognitive])


    // 데이터 불러오기


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
                                                <h3 className="mb-0">BDI 검사(2차) 결과</h3>
                                            </Col>
                                            <Col className="text-right" xs="4">
                                               
                                            </Col>
                                        </Row>
                                    </CardHeader>

                                    <CardBody>
                                        <>

                                        <div>
                                            {  `DBI_resultScore: ${DBI_resultScore}`}
                                        </div>
                                     {DBI_surveyDataParsing.map((data)=>{
                                        return (
                                        <>
                                        <div>
                                            {`${data.category}, ${data.name}, ${data.level}, ${data.content}`}
                                        </div>
                                        </>
                                        )
                                     })}


                                     <br/>

                                     {DBI_SymptomsCognitiveDataParsing.map((data)=>{
                                        return (
                                        <>
                                        <div>
                                            {`${data.category}, ${data.name}, ${data.level}`}
                                        </div>
                                        </>
                                        )
                                     })}
                                      <br/>

                                    
                                      {DBI_SymptomsEmotionalDataParsing.map((data)=>{
                                        return (
                                        <>
                                        <div>
                                            {`${data.category}, ${data.name}, ${data.level}`}
                                        </div>
                                        </>
                                        )
                                     })}
                                      <br/>
                                      
                                     {DBI_SymptomsMotivationalDataParsing.map((data)=>{
                                        return (
                                        <>
                                        <div>
                                            {`${data.category}, ${data.name}, ${data.level}`}
                                        </div>
                                        </>
                                        )
                                     })}
                                      <br/>
                                      
                                     {DBI_SymptomsPhysicalDataParsing.map((data)=>{
                                        return (
                                        <>
                                        <div>
                                            {`${data.category}, ${data.name}, ${data.level}`}
                                        </div>
                                        </>
                                        )
                                     })}
                                      <br/>
                                        </>
                                     

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


