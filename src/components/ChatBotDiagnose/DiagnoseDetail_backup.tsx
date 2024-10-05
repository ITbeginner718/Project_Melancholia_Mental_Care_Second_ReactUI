// reactstrap components
import { Badge,  Card,   Table,  Container, Row,  Toast, ToastHeader, ToastBody } from "reactstrap";
// core components
import Header from "../Headers/Header.jsx";
import {  useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";


export interface DiagnoseRequestResponse {
    request: string;
    response_score: string;
    response_text: string;
}

//인터페이스 작성 
export interface IDiagnose {
    userID?: string;  //무조건 사용되는 것 아님
    Credential?: number;  //무조건 사용되는 것 아님
    diagnoseDate: string;
    questionResponseData: string;
    resultScore: string;
    resultText: string;
    id: string;
}

export default function DiagnoseDetail() {

    // 연산
    const { id } = useParams();
    const [diagnoseObject, setDiagnoseObject] = useState<IDiagnose>(); // 각 멤버 개체에 대한 타입을 지정할 때 ?연산자 정의 되지 않는 변수들은 무조건 사용되어야 함.  

    // 배열 설정
    const [diagnoseRequestResponse, setDiagnoseRequestResponse] = useState<DiagnoseRequestResponse[]>([]);

    // const [updateFeeling, setFeeling] = useState("");
    const [date, setDate] = useState("");

    //질의 응답 정보 데이터
    const [questionResponse, setQuestionResponse] = useState("");

    //진단 검사 정보(점수)
    const [diagnoseResultScore, setDiagnoseResultScore] = useState("");

    //진단 검사 정보(텍스트)
    const [diagnoseResultText, setDiagnoseResultText] = useState("");

    // 카운트
    const [count, setCount] = useState(0);

    useEffect(() => {

        // 강제 리턴
        // 이거 다시 공부해야 함+++++++++++++++++++++++++++++++++++++++++
        // 질의-응답 데이터를 parsing하는 과정에서 비동기로 인하여 먼저 데이터를 parsing하기도 전에 렌더링이 되다 보니깐 
        // 페이지 결과값이 로드가 안됨
        if (count >= 2)
            return;

        // 특정 문서 ID를 이용하여 데이터를 가져오는 비동기 함수
        const getDocumentData = async () => {
            //타입이 string인지 체크
            if (typeof id === "string") {
                try {
                    // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
                    const docRef = doc(db, "diagnoses", id);

                    // 참조를 사용하여 문서 정보 가져오기
                    const docSnap = await getDoc(docRef);

                    // 문서의 존재 여부 확인 및 데이터 출력

                    //해당 쿼리에 대한 모든 문서 반환 
                    if (docSnap.exists()) {

                        // docSnap.data()에 있는 각들을 가져오기
                        const { resultText, resultScore, questionResponseData, diagnoseDate } = docSnap.data();

                        const diagnoseObjectData = () => {

                            return { resultText, resultScore, questionResponseData, diagnoseDate, id: docSnap.id, }
                        }

                        // 진단 객체 설정
                        setDiagnoseObject(diagnoseObjectData);
                        console.log(diagnoseObject);

                        if (typeof diagnoseObject?.diagnoseDate === "string") {
                            setDate(diagnoseObject.diagnoseDate);
                        }

                        if (typeof diagnoseObject?.questionResponseData === "string") {
                            setQuestionResponse(diagnoseObject.questionResponseData);
                        }

                        if (typeof diagnoseObject?.resultScore === "string") {
                            setDiagnoseResultScore(diagnoseObject.resultScore);
                        }

                        if (typeof diagnoseObject?.resultText === "string") {
                            setDiagnoseResultText(diagnoseObject.resultText);
                        }
                    }
                }
                catch (error) {
                    console.log("Document does not exist");
                }

                finally {
                    setCount((current) => (current + 1));
                }

            }

        };

        getDocumentData();

        console.log("진단 검사 재 렌더링");

        // 데이터를 다 불러오기도 전에 컴포넌트가 dom에 등록되기 때문에 아무것도
        // 아무것도 안보이게 됨 그래서 데이터를 다 불러올 때까지 계속적으로 
        // 컴포넌트를 재렌더링 해줘야 함 
        // diagnoseObject?.questionResponseData
    }, [count])

    useEffect(() => {

        if (questionResponse) {
            // 데이터 파싱
            const questionResponseParsing = questionResponse.split('@b');

            const questionResponseData = questionResponseParsing.map((data) => {
                const parsingData = data.split('\n');
                // request:string;
                // response_score:string;
                // response_text:string;
                console.log("응답-데이터 파싱")
                return {
                    request: parsingData[0],
                    response_score: parsingData[1],
                    response_text: parsingData[2],
                }
            });

            setDiagnoseRequestResponse(questionResponseData);
        }
    }, [questionResponse])


    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid >
                <Row>
                    <div className="col" >
                        <Card className="shadow border-0" style={{ padding: "20px" }}>
                            <h1>
                                AI 우울증 진단 검사 문진표{' '}
                                <Badge color="primary">
                                    {date}
                                </Badge>
                            </h1>

                            <Table>
                                <thead>
                                    <tr>
                                        <th>
                                            Quest
                                        </th>
                                        <th>
                                            Response(text)
                                        </th>
                                        <th>
                                            Response(score)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        questionResponse ?
                                            diagnoseRequestResponse.map((data) => (

                                                <tr className="table-info">
                                                    <td>
                                                        {data.request}
                                                    </td>

                                                    <td>
                                                        {data.response_text}
                                                    </td>

                                                    <td>
                                                        {data.response_score}
                                                    </td>
                                                </tr>

                                            )) : (<div>no diagnose data found</div>)
                                    }
                                </tbody>
                            </Table>

                            <hr />

                            {/* 검사표 */}
                            <Toast>
                                <ToastHeader>
                                    진단 결과
                                </ToastHeader>
                                <ToastBody>
                                    <h1>
                                        상태: {diagnoseResultText}{' '}
                                        <Badge color="primary" pill>
                                            총점: {diagnoseResultScore}
                                        </Badge>
                                    </h1>
                                    
                                </ToastBody>
                            </Toast>
                        </Card>

                    </div>
                </Row>
            </Container>
        </>
    )
}