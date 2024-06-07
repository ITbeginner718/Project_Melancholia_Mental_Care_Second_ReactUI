import axios from 'axios';
import Header from "components/Headers/Header.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Badge, Button, Card, CardBody,
    CardHeader,
    Col, Container, Form, FormGroup, Input, Label,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import { db } from "../../firebase";
// 
// import { IDiary } from "../../../views/example/Profile";

//인터페이스 작성 
export interface IDiary {
    // photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
    diaryTitle: string;
    diaryContent: string;
    diaryDate: string;
    id: string;
    userID?:string;  //무조건 사용되는 것 아님
    credential?: number; //무조건 사용되는 것 아님
    feeling?:string; //무조건 사용되는 것 아님
  }

export default function DiaryDetail() {
    const { id } = useParams();
    const [diaryObject, setDiaryObject] = useState<IDiary | null>(null);
    const [updateDiaryTitle, setDiaryTitle] = useState("");
    const [date, setDate] = useState("");
    const [updateDiaryContent, setDiaryContent] = useState("");
    const [analysisResult, setAnalysisResult] = useState(""); // 감정 분석 결과
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [modal, setModal] = useState(false); // 모달 상태
    const navigate = useNavigate();

    const toggleModal = () => setModal(!modal);

    // 프롬프트
    const PROMPT_TEXT="다음 [일기 내용]을 [분석]하여 주된 감정을 [한 단어]로 한글로 대답해 주세요. 가능한 한 간단하고 명확하게 응답하세요." 
    
    useEffect(() => {
        async function getDocumentData() {
            if (typeof id === "string") {
                const docRef = doc(db, "diaries", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as IDiary;
                    setDiaryObject(data);
                    setDiaryTitle(data.diaryTitle);
                    setDiaryContent(data.diaryContent);
                    setDate(data.diaryDate);
                }
            }
        }
        getDocumentData();
    }, [id]);

    const onChangeDiaryTitle = (e: React.ChangeEvent<HTMLInputElement>) => setDiaryTitle(e.target.value);
    const onChangeDiaryContent = (e: React.ChangeEvent<HTMLElement>) => {
        const { value } = e.target as HTMLInputElement;
        setDiaryContent(value);
    };

    const onUpdateDiary = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ok = window.confirm("해당 일기를 저장하겠습니까?");
        if (!ok) return;

        try {
            setIsLoadingUpdate(true);
            if (typeof id === "string") {
                const docRef = doc(db, "diaries", id);
                await updateDoc(docRef, {
                    diaryTitle: updateDiaryTitle,
                    diaryContent: updateDiaryContent,
                });
                navigate("/admin/user-profile");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    // gpt api
    const handleAnalyze = async () => {
        if (diaryObject) {
            // 키값 지정 
            const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
            // 예외 처리 
            if (!apiKey) {
                console.error("OpenAI API key is not set in environment variables");
                return;
            }

            try {
                const response = await axios.post(
                    // url로 가져오는 방식
                    'https://api.openai.com/v1/chat/completions',
                    {
                        // model: 'gpt-3.5-turbo',
                        model: 'gpt-4o',
                        messages: [
                            // 프롬프트(역할) 지정 
                            { role: 'system', content: PROMPT_TEXT},
                            // 일기 데이터
                            { role: 'user', content: diaryObject.diaryContent },
                        ],
                        // 답변 토큰 지정, 제한 (10토큰이상으로 오는 답변 짤리는 것)
                        max_tokens: 10, //대략 5글자 
                        temperature: 0.5, //창의적인 대답의 정도(0.0~1.0)
                    },

                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                // choices[0].message: gpt 답변
                const analysis = response.data.choices[0].message?.content.trim() || "No analysis result.";

                // 감정 분석 결과 데이터 저장
                setAnalysisResult(analysis);
                
                toggleModal();

            } catch (error) {
                console.error("Error analyzing diary:", error);
            }
        }
    };

    // 유트브
    const handleVideoRecommendation = () => {
        if (analysisResult) {
            const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(analysisResult + "음악")}`;
            window.open(youtubeSearchUrl, '_blank');
        }
    };

    if (!diaryObject) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
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
                                                src={require("../../assets/img/theme/team-4-800x800.jpg")}
                                            />
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4">
                                <Row>
                                    <div className="col">
                                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                            <div>
                                                <span className="heading">22</span>
                                                <span className="description">Friends</span>
                                            </div>
                                            <div>
                                                <span className="heading">10</span>
                                                <span className="description">Photos</span>
                                            </div>
                                            <div>
                                                <span className="heading">89</span>
                                                <span className="description">Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="text-center">
                                    <h3>
                                        Jessica Jones
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

                    <Col xl="8">
                        <Card className="shadow border-0">
                            <CardBody>
                                <h1>
                                    오늘의 감정 일기{' '}
                                    <Badge color="primary">{date}</Badge>
                                </h1>
                                <Form onSubmit={onUpdateDiary}>
                                    <FormGroup>
                                        <Label for="exampleSelect">오늘의 하루</Label>
                                        <Input
                                            bsSize="lg"
                                            className="mb-3"
                                            placeholder="어떠셨나요?"
                                            onChange={onChangeDiaryTitle}
                                            value={updateDiaryTitle}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">당신의 마음속 이야기</Label>
                                        <Input
                                            rows={10}
                                            maxLength={180}
                                            onChange={onChangeDiaryContent}
                                            value={updateDiaryContent}
                                            id="exampleText"
                                            name="text"
                                            type="textarea"
                                        />
                                    </FormGroup>
                                    <Button type="submit" color="primary" className="mr-2">
                                        {isLoadingUpdate ? "Posting..." : "Update Board"}
                                    </Button>
                                    <Button type="button" color="info" onClick={handleAnalyze}>
                                        Analyze Diary
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* 모달 컴포넌트 */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Analysis Result</ModalHeader>
                <ModalBody>
                    <p>{analysisResult}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleVideoRecommendation}>
                        Recommend Video
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}