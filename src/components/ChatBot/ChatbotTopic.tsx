import Header from "@components/Headers/Header";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, Row, Col, CardBody, CardTitle, CardText, Button, Container, Spinner, Alert } from "reactstrap";
import { auth, db } from "@/firebase";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";

interface IcounselRecords {
    counselingDate: string;
    counselingSummary:string;
}

export default function ChatbotTopic() {
    const user = auth.currentUser;
    const navigate = useNavigate();
    // 게시판 정보 id값 가져오기
    const { keyword } = useParams();
    const [topic, setTopic] = useState("");
    const [counselRecords, setCounselRecords] = useState<IcounselRecords[]>([]);
    // 
    const [counselId, setCounselId]= useState<string |null> (null);

    useEffect(() => {
        if (keyword) {
            setTopic(decodeURI(decodeURIComponent(keyword)));
            //데이터 가져오기
            fetchCounselRecord(keyword);
        }
        else {
            console.log("못 가지고옴")
        }
    }, [])

    const fetchCounselRecord = async (keyword: string) => {

        // 상담 기록 데이터 불러오기
        const counselQuery = query(collection(db, "counseling"), where("userId", "==", user?.uid), where("topic", "==", keyword), orderBy("Credential", "asc"),);

        const querySnapshot = await getDocs(counselQuery);

        // 값 배열에 저장
        const counselRecords = querySnapshot.docs.map(( document,index) => {

            console.log(index, querySnapshot.size);
            const { counselingDate, counselingSummary } = document.data()

            
            if(querySnapshot.size === (index+1))
            {
                //해당 topic에 대한 마지막 대화 내역 id 저장
                setCounselId(document.id);
            }

            return {
                counselingDate, counselingSummary
            };
        })

        setCounselRecords(counselRecords);
    }




    const onMovechatbotCounsel = (keyword: string) => {
        //정말 삭제 할 것인지 사용자 확인 
        // eslint-disable-next-line no-restricted-globals
        const ok = confirm(`${keyword}을 주제로 상담을 진행하겠습니까?`);

        console.log(keyword);

        if (ok) {

            navigate(`/Admin/ChatbotCounsel/${keyword}/${counselId}`);
        }
    }
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
                                    onClick={() => { onMovechatbotCounsel(topic) }}
                                    size="lm"
                                >
                                    상담 시작
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>

                    <CardBody>

                        {/* 검사표 삽입 */}
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">
                                            {topic && `${topic} 상담 기록`}
                                        </h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                
                                    {
                                        counselRecords && counselRecords.map((counselRecord, index) => (
                                            <>
                                                <Alert color="secondary">
                                                    <h1 className="alert-heading">
                                                        {`${index + 1}번 째 상담 `}
                                                    </h1>
                                                    <p>
                                                        {counselRecord.counselingSummary}
                                                    </p>
                                                    <hr />
                                                    <h1 className="mb-0">
                                                    {counselRecord.counselingDate}
                                                     </h1>
                                                </Alert>
                                            </>
                                        ))
                                    }

                                    {
                                        counselRecords.length==0 && <>
                                        
                                        <Col sm="6">
                                            <Card body>
                                            <CardTitle tag="h5">
                                                상담 내역이 없음
                                            </CardTitle>
                                            <CardText>
                                                {topic}에 관한 상담 기록이 없습니다. 첫 번째 상담을 진행해주세요
                                            </CardText>
                                            <Button  onClick={() => { onMovechatbotCounsel(topic) }}>
                                                상담 시작
                                            </Button>
                                            </Card>
                                        </Col>
                                        </>
                                    }
                                <br />
                            </CardBody>
                        </Card>
                    </CardBody>
                </Card>
            </Container>




        </>
    )
}