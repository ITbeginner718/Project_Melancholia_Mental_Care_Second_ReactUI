import { IDiary } from "../../views/examples/Profile";
// reactstrap components
import { Badge, Button, Card, CardBody, Col, CardImg, CardText, CardTitle, Container, Form, FormGroup, FormText, Input, Label, Row, CardHeader } from "reactstrap";
// core components
import Header from "../Headers/Header.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
// 이미지 
import Image from "../../assets/img/theme/team-4-800x800.jpg";

export default function DiaryDetail() {

    // 연산
    const { id } = useParams();
    const [diaryObject, setDiaryObject] = useState<IDiary>();

    const [updateDiaryTitle, setDiaryTitle] = useState("");
    const [updateFeeling, setFeeling] = useState("");
    const [date, setDate] = useState("");
    const [updateDiaryContent, setDiaryContent] = useState("");

    const navigate = useNavigate();
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);


    //제목
    const onChangeDiaryTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiaryTitle(e.target.value);
        console.log("diaryTitle:", { updateDiaryTitle });
    }

    //감정
    const onChangeFeeling = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeeling(e.target.value);
        console.log("Feeling:", { updateFeeling });
    }

    //내용 
    const onChangeDiaryContent = (e: React.ChangeEvent<HTMLElement>) => {
        const { value } = e.target as HTMLInputElement;
        setDiaryContent(value);
      }


    function resetDiary() {
        setDiaryTitle("");
        setFeeling("");
        setDiaryContent("");
    }

    useEffect(() => {

        // 특정 문서 ID를 이용하여 데이터를 가져오는 비동기 함수
        async function getDocumentData() {
            //타입이 string인지 체크
            if (typeof id === "string") {
                // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
                const docRef = doc(db, "diaries", id);

                // 참조를 사용하여 문서 정보 가져오기
                const docSnap = await getDoc(docRef);

                // 문서의 존재 여부 확인 및 데이터 출력

                //해당 쿼리에 대한 모든 문서 반환 
                if (docSnap.exists()) {
                    const diaryObject = () => {

                        const { diaryTitle, diaryContent, diaryDate, feeling } = docSnap.data();

                        return { diaryTitle, diaryContent, diaryDate, feeling, id: docSnap.id, }
                    }
                    setDiaryObject(diaryObject);
                }
            }

        }

        getDocumentData();

        //  updateDoc 상태는 여전히 초기 상태일 수 있으며, 따라서 undefined일 수 있습니다.
        // , doc_tweet 함수를 실행한 결과를 updateDoc 상태에 저장해야 합니다. 
        //그리고 updateDoc 상태가 업데이트된 후에 tweet 상태를 업데이트하려면, 
        //이 로직을 useEffect 훅 안에 넣어 updateDoc 상태의 변경을 감지하여 처리

        if (typeof diaryObject?.diaryTitle === "string") {
            setDiaryTitle(diaryObject.diaryTitle);
        }

        if (typeof diaryObject?.diaryContent === "string") {
            setDiaryContent(diaryObject.diaryContent);
        }

        if (typeof diaryObject?.feeling === "string") {
            setFeeling(diaryObject.feeling);
        }

        if (typeof diaryObject?.diaryDate === "string") {
            setDate(diaryObject.diaryDate);
        }

        // 도대체 이유를 모르겠네.... 
    }, [diaryObject?.diaryTitle])


    const onUpdateDiary = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // eslint-disable-next-line no-restricted-globals
        const ok = confirm("해당 일기를 저장하겠습니까?");

        if (!ok) return;

        try {
            setIsLoadingUpdate(true);
            //타입이 string인지 체크
            if (typeof id === "string") {
                // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
                const docRef = doc(db, "diaries", id);

                // 일기 document 업데이트
                await updateDoc(docRef, {
                    diaryTitle: updateDiaryTitle,
                    diaryContent: updateDiaryContent,
                });
                navigate("/admin/user-profile");
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsLoadingUpdate(false);
        }

    }
    
    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid >
                <Row>
                    {/* 도움말 */}
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                        <Card className="card-profile shadow">
                            <Row className="justify-content-center">
                                <Col className="order-lg-2" lg="3">
                                    <div className="card-profile-image">
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                className="rounded-circle"
                                                src={Image}
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

                    <div className="col" >
                        <Card className="shadow border-0" style={{ padding: "20px" }}>
                            <h1>
                                오늘의 감정 일기{' '}
                                <Badge color="primary">
                                    {date}
                                </Badge>
                            </h1>
                            <hr />
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
                                    <Label for="exampleSelect">
                                        AI 분석 감정
                                    </Label>
                                    <Input
                                        id="exampleSelect"
                                        name="select"
                                        type="select"
                                        value={updateFeeling}
                                        onChange={onChangeFeeling}>
                                        
                                        <option>
                                            {updateFeeling}
                                        </option>
                                    </Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">
                                        당신의 마음속 이야기
                                    </Label>
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

                                <Button type="submit">
                                    {isLoadingUpdate ? "Post Update" : "Update Board"}
                                </Button>
                            </Form>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    )
}