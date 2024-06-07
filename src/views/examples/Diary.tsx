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
// reactstrap components
import {
    Card,
    CardHeader,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Row,
    Button,
    Input,
    FormGroup,
    Label,
    FormText,
    Form,
    Col,
    Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.jsx";

import axios from 'axios';
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";


const Diary = () => {

    // 현재 유저를 불러오기 
    const user = auth.currentUser;

    const [isLoading, setIsLoading] = useState(false);
    const [diaryTitle, setDiaryTitle] = useState("");

    const [diaryContent, setDiaryContent] = useState("");
    const navigate = useNavigate();

    // 감정 분석 모달 state
    const [modal, setModal] = useState(false);
    // 감정 분석 모달 창 띄우기 
    const toggle = () => setModal(!modal);

    // 감정 분석 결과
    const [feeling, setFeeling] = useState("");

    // 프롬프트
    const PROMPT_TEXT = "다음 [일기 내용]을 [분석]하여 주된 감정을 [한 단어]로 한글로 대답해 주세요. 가능한 한 간단하고 명확하게 응답하세요."

    //제목
    const onChangeDiaryTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiaryTitle(e.target.value);
        console.log("diaryTitle:", { diaryTitle });
    }

    //내용 
    const onChangeDiaryContent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiaryContent(e.target.value);
        console.log("diaryContent:", { diaryContent });
    }

    function resetDiary() {
        setDiaryTitle("");
        setDiaryContent("");
    }

    // 감정 분석 값 state감지
    // setState() 함수가 비동기로 돌아가기 때문에 gptAPI 결과값을 먼저 받기도 전에 firebase 저장을 실행 
    // feeling 값이 setState()함수에 잘 들어오면 그때 데이터 저장 

    useEffect(() => {
        // 처음 렌더링 될 때 useEffect가 실행되므로 
        // 빈 값이 들어갈 때는 API를 호출하지 않는 방어코드도 넣어줍니다.

        if (feeling !== "") {
            //데이터 저장
            saveDiary();
        }

    }, [feeling])

    //전송 이벤트 
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        // eslint-disable-next-line no-restricted-globals
        const isConfirm = confirm("등록하시겠습니까?");

        if (!user || !isConfirm || isLoading || diaryContent === "" || diaryContent.length > 180) return;

        // gpt api 감정 분석 기능
        await diaryContentAnalyze_GPTAPI();
    }

    // gpt api
    const diaryContentAnalyze_GPTAPI = async () => {

        if (diaryContent) {
            // 키값 지정 
            const apiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;
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
                            { role: 'system', content: PROMPT_TEXT },
                            // 일기 데이터
                            { role: 'user', content: diaryContent },
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

                console.log(analysis);

                // 감정 분석 결과 데이터 저장
                setFeeling(analysis);

            } catch (error) {
                console.error("Error analyzing diary:", error);
            }

        }
    };

    const saveDiary = async () => {

        try {

            setIsLoading(true);
            //데이터 베이스 신청 
            //컬레션을 지정(추가)해줘야 함 
            // *중요* 현재 데이터베이스는 테스트 용으로 30일 뒤에 삭제 
            // 생성된 document의 참조를 promise로 반환할 수 있음 

            //날짜 생성
            const date = new Date();

            console.log("firebase 저장 전 feeling:", feeling);

            // 생성된 document의 참조를 promise로 반환할 수 있음
            const doc = await addDoc(collection(db, "diaries"), {

                //일기 제목
                diaryTitle,

                //예측 감정
                feeling,

                //일기 내용
                diaryContent,

                //날짜 
                diaryDate: (date.getFullYear() + "-" +
                    ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
                    ("0" + (date.getDate())).slice(-2) + "-" +
                    ("0" + (date.getHours())).slice(-2) + ":" +
                    ("0" + (date.getMinutes())).slice(-2) +
                    ":" + ("0" + (date.getSeconds())).slice(-2)),

                //일기 고유 ID 
                credential: Date.now(),

                //사용자 ID
                userID: user?.uid,

                // tweet,// 게시판 내용 
                // Credential: Date.now(),//특정 시간부터 경과한 밀리초(millisecond 반환) 
                // // 작성자 유저 닉네임:, 유저 닉네임이 없으면 익명으로 저장 
                // username: user.displayName || "Anonymous",
                // //트윗을 삭제하고자 할 때 트윗을 삭제할 권한이 있는 유저를 구분
                // //트윗을 삭제하려는 유저의 ID와 여기 userID에 저장된 ID가 일치하는 확인 
                // userId: user.uid,
            });

            // Api 호출 일기 내용 분석

            //일기 데이터 초기화 
            resetDiary();

            // 성공시 아이디 값 전송(async 라서 값이 전달 안될 수도 있음)
            const id = doc.id;

            //페이지 이동
            navigate(`/admin/mediarecommand/${id}`);

            // 감정 분석 결과 모델 창


        } catch (error) {
            console.log(error);
        }

        finally {
            setIsLoading(false);
        }

    }


    return (
        <>
            {/* 헤더 */}
            <Header />
            {/* 게시판 작성 페이지*/}
            <Container className="mt--7" fluid>
                {/* Table */}

                <Row>
                    <div className="col">
                        <Card className="shadow">

                            {/* 끝에 배치 */}
                            <CardHeader className="border-0">
                                <h3 className="mb-0">당신의 마음을 관찰하는 시간입니다. </h3>

                                <Col style={{ borderBottom: "1px solid #CCC", margin: "10px 0" }}></Col>

                                <Form onSubmit={onSubmit}>

                                    <Form>
                                        <Label for="exampleSelect">오늘의 하루를 한 문장으로 표현해주세요.</Label>
                                        <Input
                                            bsSize="lg"
                                            className="mb-3"
                                            placeholder="어떠셨나요?"
                                            onChange={onChangeDiaryTitle}
                                            value={diaryTitle}
                                        />
                                    </Form>

                                    <FormGroup>

                                    </FormGroup>
                                    
                                    <FormGroup>
                                        <Label for="exampleText">
                                            어떤 말이든 좋아요. 편하게 얘기하세요.
                                        </Label>
                                        <Input
                                            rows={10}
                                            maxLength={180}
                                            onChange={onChangeDiaryContent}
                                            value={diaryContent}
                                            id="exampleText"
                                            name="text"
                                            type="textarea"
                                        />
                                    </FormGroup>

                                    <Button color="info" outline type="submit">{isLoading ? "Posting" : "Post Diary"}</Button>
                                </Form>
                            </CardHeader>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default Diary;
