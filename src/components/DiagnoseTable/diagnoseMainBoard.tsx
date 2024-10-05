
// reactstrap components
import { Navigate, UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import {
    Button, Card,CardBody, CardHeader, Col, Row, CardTitle, CardText
} from "reactstrap";
import { auth, db } from "@/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useState } from "react";


export default function DiagnoseMainBoard() {


const user =auth.currentUser;

//진단 여부
const [isDiagnoseResult, setIsDiagnoseResult]= useState<Boolean|null>(null);    

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

//값이 없으면 종료 
if(snapshot.empty)
{
    return;
}

else
{
    
}
const docData = snapshot.docs[0].data();
const localIsSatisfied:Boolean = docData.isSatisfied;

console.log("진단 여부:", localIsSatisfied);


}


    const navigate = useNavigate();

    const onMoveDSM5 =()=>{
    //정말 삭제 할 것인지 사용자 확인 
    // eslint-disable-next-line no-restricted-globals
    const ok = confirm("DSM5 검사를 진행하겠습니까?");

    if(ok)
    {
        navigate("/admin/Diagnose_DSM5");
    }

    }

    return (
        <>
                       {/* 검사표 삽입 */}
            <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                            <h3 className="mb-0">우울증 진단 검사</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        {/* 우울 장애 진단 통계편람(DSM-5)의 진단 기준 */}
                        <Col sm="6">
                            <Card body>
                                <CardTitle tag="h2">
                                    우울 장애 진단 통계편람(DSM-5)
                                </CardTitle>
                                <CardText>
                                    주요우울장애(Major Depressive Disorder)진단 우울증에 발병되었을 때 주요 증상을 보이고 있는지 검사함
                                </CardText>
                                <Button onClick={onMoveDSM5} color="primary">
                                    검사 시작
                                </Button>
                            </Card>
                        </Col>
                        {/* 벡 우울 척도 검사 */}
                        <Col sm="6">
                            <Card body>
                                <CardTitle tag="h2">
                                    벡 우울 척도(BDI:Beck Depression Inventory)
                                </CardTitle>
                                <CardText>
                                    21개 문항으로 구성된 가장 널리 사용되는 우울증 정도 판단 도구입니다. 아론 백(Aeron Beck)이 개발한 우울증 검사로 일반적으로 많이 사용되는 검사. 인지, 정서, 동기, 신체적 증상 등 21개의 문항으로 우울증 테스트 진행
                                </CardText>
                                <Button color="primary" >
                                    검사 시작
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
                
          

        </>
    )
}