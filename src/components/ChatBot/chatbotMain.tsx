
// reactstrap components
import { Navigate, UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import {
    Button, Card,CardBody, CardHeader, Col, Row, CardTitle, CardText,
    Badge
} from "reactstrap";
import { auth, db } from "@/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import useDidMountEffect from "@components/hooks/useDidMountEffect";

interface DBIResultContentSurvey
{
    category: string;
    name: string;
    level: string;
    content?: string;
}


  

export default function ChatbotMain() {

const user =auth.currentUser;
const navigate = useNavigate();

const[DBI_Symptoms_Cognitive, setDBI_Symptoms_Cognitive] =useState<string>();
const [DBI_SymptomsCognitiveDataParsing, setDBI_SymptomsCognitiveDataParsing] =useState<DBIResultContentSurvey[]>([]);

    //인지적 증상 데이터 불러오기
const  fetchDBIResultMotivationalSymptoms= async () => {

    //DSM 1차 진단 결과 데이터 불러오기 
        const tweetQuery = query(
            collection(db, "diagnoseBDIresult_treatment_keyword"),
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
    
            //값이 없으면 종료 
            if(snapshot.empty)
            {
                return;
            }
    
            else
            {
                const docData = snapshot.docs[0].data();
                const localDBIResultCognitiveSymptoms:string = docData.DBIResultCognitiveSymptoms;
        
                console.log("인지적 증상 데이터:", localDBIResultCognitiveSymptoms);
    
                setDBI_Symptoms_Cognitive(localDBIResultCognitiveSymptoms);
            }
    
            }

const onMovechatbotTopic =(name:string)=>{
    
    const keyword = encodeURI(encodeURIComponent(name));
    
    console.log(keyword);
   
    navigate(`/Admin/ChatbotTopic/${keyword}`);

}


        useEffect(()=>{
            fetchDBIResultMotivationalSymptoms();
        },[])

        //DBI_Symptoms_Cognitive 데이터 갖고 오면 parsing 진행
        useDidMountEffect(()=>{

        if (DBI_Symptoms_Cognitive) {
            // 데이터 파싱
            const DBI_surveyDataParsing = DBI_Symptoms_Cognitive.split('@');
    
            const DBI_cognitiveKeywordtData = DBI_surveyDataParsing.map((data) => {
                const parsingData = data.split('|');
    
                console.log("DBI_Symptoms_Cognitive 파싱")
                return {
                    category: parsingData[0],
                    name: parsingData[1],
                    level: parsingData[2],
                }
            });
    
            setDBI_SymptomsCognitiveDataParsing(DBI_cognitiveKeywordtData);
        }

        },[DBI_Symptoms_Cognitive])


        

    return (
        <>
            {/* 검사표 삽입 */}
            <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                            <h3 className="mb-0">
                            </h3>
                        </Col>
                        <Col className="text-right" xs="4">
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        {/* AI 챗봇 */}
                        {DBI_SymptomsCognitiveDataParsing && DBI_SymptomsCognitiveDataParsing.map((symptomsCognitiveData)=>(
                            <>
                            <Col sm="6">
                            <Card body>
                                <CardTitle tag="h2">
                                    AI 상담 주제
                                </CardTitle>
                                <CardText>
                                    {`${symptomsCognitiveData.name} - ${symptomsCognitiveData.level}`}
                        
                                </CardText>
                                {/* 무명 함수로 진행 */}
                                <Button color="primary" onClick={()=>{onMovechatbotTopic(symptomsCognitiveData.name)}}>
                                    상담 시작
                                </Button>
                            </Card>
                            <br/>
                        </Col>
                            </>
                        ))}
                    </Row>
                    <br/>
                </CardBody>
            </Card>

        </>
    )
}