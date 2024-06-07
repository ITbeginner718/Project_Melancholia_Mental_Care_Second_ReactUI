
import { Unsubscribe, collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Row,
    Button,
    Col,
    CardBody,
} from "reactstrap";
import Diagnose from "../ChatBotDiagnose/Diagnose";


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

export default function TimelineMyDiagnose() {
    // 사용자 정보
    const user = auth.currentUser;

    // 배열 설정
    const [diagnoses, setDiagnoses] = useState<IDiagnose[]>([]);

    useEffect(() => {
        // useEffect는 1번만 실행(사실 1번만 실행되게 했어도 2번 실행)
        let unsubscribe: Unsubscribe | null = null;

        // 사용자가 작성한 tweet만 보여주기
        const fetchDiagnoses = async () => {
            const diagnoseQuery = query(
                collection(db, "diagnoses"),
                // 유저 ID가 같은 트윗들만 가져오기
                // profile.tsx:116 Uncaught (in promise) 
                // FirebaseError: The query requires an index
                // what the fucking index?
                /*
                    => where("userId", "==", user?.uid), 
                    이러한 필터 명령어를 firestore에 알려야 함
                    오류에서 제공하는 url 사이트로 이동
                    */
                where("userID", "==", user?.uid),
                orderBy("Credential", "desc"),
                limit(25),
            );

            // 스냅샷
            unsubscribe = await onSnapshot(diagnoseQuery/* 쿼리 등록*/, (snapshot) => {

                // 값 배열에 저장
                const diagnoses = snapshot.docs.map((document) => {

                    const { resultScore, resultText, questionResponseData, diagnoseDate, userID, Credential } = document.data();

                    return {
                        resultScore, resultText, questionResponseData, diagnoseDate, userID, Credential,
                        id: document.id,
                    };
                }

                );
                setDiagnoses(diagnoses);
            })

        }

        // 함수 호출
        fetchDiagnoses();

        return () => {

            // 타임라인 컴포넌트가 마운트될때 구독
            // 언마운트되면 구독 취소
            //해당 함수가 호출되면 onSnapshot작동이 중지 됨
            unsubscribe && unsubscribe();// => unsubcribe가 참으로 간주되면 unsubscribe()호출된다는 뜻
            console.log("diagnoseUnsubcribe called");
        }

    }, [])


    return (
        <>
            <Card className="bg-secondary shadow mt-5">
                <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                            <h3 className="mb-0">My Diagnose</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                            <Button
                                color="primary"
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                                size="sm"
                            >
                                Settings
                            </Button>
                        </Col>
                    </Row>
                </CardHeader>

                <CardBody>

                    <Table className="align-items-center table-flush bg-white" responsive>
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Score</th>
                                <th scope="col">Date</th>
                                <th scope="col" />
                            </tr>
                        </thead>

                        {/* 일기 리스트 출력 */}
                        {diagnoses.map((diagnose) => (
                            <Diagnose key={diagnose.id} {...diagnose} />
                        ))}

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
                </CardBody>
            </Card>
        </>
    )
}