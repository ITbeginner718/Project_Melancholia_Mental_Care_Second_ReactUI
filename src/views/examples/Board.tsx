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
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.jsx";
import Timeline from "../../components/Board/timeline";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios";

const Tables = () => {

    // 현재 유저를 불러오기 
    const user = auth.currentUser;

    // 연산
    const [isLoading, setIsLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    const [boardAnalyze, setBoardAnalyze] = useState("");       


    // 프롬프트
    const PROMPT_TEXT = "다음 [게시글 내용]을 [분석]하여 제 3자에게 [행복한 내용],[응원이 되는 내용],[위로가 되는 내용],[동기부여가 되는 내용],[활기찬 내용],[힘이 되는 내용] 등 긍정적인 부분을 전달하는 내용이면 [승인]이라고 응답하고 그렇지 않은 모든 것들은 전부 다 [거절]이라고 응답하세요"

    useEffect(() => {

        // 처음 렌더링 될 때 useEffect가 실행되므로 
        // 빈 값이 들어갈 때는 API를 호출하지 않는 방어코드도 넣어줍니다.
        if(!boardAnalyze || boardAnalyze === "") {

            return;
        }   

        if(boardAnalyze === "[승인]") {
            // 게시글 작성
            saveBoard();
        }

        else if(boardAnalyze === "[거절]") {
            alert("좋은 표현, 좋은 내용만 작성 해주셔야 합니다. 다시 작성해주세요.");
            setTweet("");   
            setBoardAnalyze("");
        }   

    }, [boardAnalyze])

    const saveBoard = async () => {

        try {
            setIsLoading(true);
            //데이터 베이스 신청 
            //컬레션을 지정(추가)해줘야 함 
            // *중요* 현재 데이터베이스는 테스트 용으로 30일 뒤에 삭제 
            // 생성된 document의 참조를 promise로 반환할 수 있음 

            const doc = await addDoc(collection(db, "tweets"), {
                tweet,// 게시판 내용 
                Credential: Date.now(),//특정 시간부터 경과한 밀리초(millisecond 반환) 
                // 작성자 유저 닉네임:, 유저 닉네임이 없으면 익명으로 저장 
                username: user?.displayName || "Anonymous",
                //트윗을 삭제하고자 할 때 트윗을 삭제할 권한이 있는 유저를 구분
                //트윗을 삭제하려는 유저의 ID와 여기 userID에 저장된 ID가 일치하는 확인 
                userId: user?.uid,
            });

            //이미지 등록 
            //해당 파일의 위치에 대한 reference를 받아야함 
            //업로드된 파일이 저장되는 폴더명과 파일 명을 지정
            if (file) {
                try {
                    //tweets/유저 Id-유저명/ 문서 ID(문서 id가 사진이름)
                    const locationRef = ref(storage, `tweets/${user?.uid}/${doc.id}`);

                    console.log(locationRef);   
                    //파일 위치, 파일 데이터
                    //파일 업로드에 성공하면 url 등에 정보를 반환 
                    const result = await uploadBytes(locationRef, file);
                    //url 반환 
                    const url = await getDownloadURL(result.ref);
                    //해당 url를 다시 db document에 저장 
                    //이미지 파일를 업로드하고 해당 파일 url을 반환받으면 다시 document 업데이트 
                    await updateDoc(doc, {
                        photo: url,
                    })
                }
                catch (error) {
                    console.log("firebase storage Error:", error);
                }
            }
            setTweet("");
            setBoardAnalyze("");
            setFile(null);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }


    const onChange = (e: React.ChangeEvent<HTMLElement>) => {
        const { value } = e.target as HTMLInputElement;
        setTweet(value);
    }

    

        // gpt api 기능
       const boardContentAnalyze_GPTAPI = async () => {

        if (tweet) {
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
                            { role: 'user', content: tweet },
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
                setBoardAnalyze(analysis);

            } catch (error) {
                console.error("Error analyzing diary:", error);
            }

        }
    };


    // 타입이 file인 input이 변경될 때마다 파일의 배열을 받게 됨
    // 파일을 여러 개를 받을 수도 있기 때문에 예외처리 설정
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setFileError("");

            const { files } = e.target;
            //파일 크기 1MB미만으로 설정
            const MB = 1024 * 1024; //1mb(메가)

            //오로지 하나의 파일만 받게 설정
            if (files && files.length === 1) {
                //파일 크기(bytes)
                const size = files[0].size;
                //1MB 미만 크기의 파일 데이터만 등록
                if (size < MB) {
                    //첫 번째 파일을 file state에 저장
                    setFile(files[0]);
                }
                else {
                    setFileError("file size can't over 1MB");
                }
            }
        }

        catch (error) {
            console.log(error);
        }

    }


    //전송 이벤트 
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 현재 유저를 불러오기 
        const user = auth.currentUser;

        if (!user || isLoading || tweet === "" || tweet.length > 180) return;

        //텍스트 분석
        await boardContentAnalyze_GPTAPI(); 

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
                                <h3 className="mb-0">여러분의 경험이 다른 삶의 행복을 줄 수 있습니다. </h3>

                                <Col style={{ borderBottom: "1px solid #CCC", margin: "10px 0" }}></Col>

                                <Form onSubmit={onSubmit}>
                                    <FormGroup>
                                        <Label for="exampleText">
                                            Content
                                        </Label>
                                        <Input
                                            rows={10}
                                            maxLength={180}
                                            onChange={onChange}
                                            value={tweet}
                                            id="exampleText"
                                            name="text"
                                            type="textarea"

                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="exampleFile">
                                            File
                                        </Label>
                                        <Input
                                            onChange={onFileChange}
                                            id="exampleFile"
                                            name="file"
                                            type="file"
                                            accept="image/*"
                                        />
                                        <FormText>
                                            This is some placeholder block-level help text for the above input. It‘s a bit lighter and easily wraps to a new line.
                                        </FormText>
                                    </FormGroup>
                                    <Button>
                                        {isLoading ? "Posting" : "Post Board"}
                                    </Button>
                                </Form>
                            </CardHeader>
                        </Card>
                    </div>
                </Row>
            </Container>



            {/* Page content */}
            <Container className="mt-7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">

                            {/* 끝에 배치 */}
                            <CardHeader className="border-0">
                                <h3 className="mb-0">기억 공유 게시판 </h3>
                            </CardHeader>

                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Summary</th>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>

                                {/* 게시판 리스트 출력 */}
                                <Timeline />

                            </Table>
                            <CardFooter className="py-4">
                                <nav aria-label="...">
                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        <PaginationItem className="disabled">
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                                tabIndex={-1}
                                            >
                                                <i className="fas fa-angle-left" />
                                                <span className="sr-only">Previous</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem className="active">
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                2 <span className="sr-only">(current)</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <i className="fas fa-angle-right" />
                                                <span className="sr-only">Next</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                </nav>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>

        </>
    );
};

export default Tables;
