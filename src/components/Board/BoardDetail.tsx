
import React, { useEffect, useRef, useState } from "react";

// reactstrap components
import { Badge, Button, Card, CardBody, CardImg, CardText, CardTitle, Container, Form, FormGroup, FormText, Input, Label, Row } from "reactstrap";

// core components
import Header from "../Headers/Header.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ImageCarousel from "./carousel";

//인터페이스 작성 
export interface ITweet {
  id: string;
  photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
  username: string;
  userId: string;
  tweet: string;
  Credential: number;
}

const BoardDetail = () => {

  // 사용자 정보 가져오기 
  const user = auth.currentUser;

  // 연산
  const [isLoading, setIsLoading] = useState(false);

  // 게시판 정보 id값 가져오기
  const { id } = useParams();
  const doc_id = id;

  // 파일 state
  const [file, setFile] = useState<File | null>(null);
  // 파일 프리뷰  string, ArrayBuffer, 또는 null 타입
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | ArrayBuffer | null>('');

  const [fileError, setFileError] = useState("");

  const [isUpdateFile, setIsUpdateFile] = useState(false);

  const navigate = useNavigate();

  const [updatedoc, setupdateDoc] = useState<ITweet>();
  const [tweetText, setTweetText] = useState("");

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { value } = e.target as HTMLInputElement;
    setTweetText(value);
  }



  useEffect(() => {

    // 특정 문서 ID를 이용하여 데이터를 가져오는 비동기 함수
    async function getDocumentData() {
      //타입이 string인지 체크
      if (typeof doc_id === "string") {
        // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
        const docRef = doc(db, "tweets", doc_id);

        // 참조를 사용하여 문서 정보 가져오기
        const docSnap = await getDoc(docRef);

        // 문서의 존재 여부 확인 및 데이터 출력

        //해당 쿼리에 대한 모든 문서 반환 
        if (docSnap.exists()) {
          const doc_tweet = () => {

            const { tweet, Credential, userId, username, photo } = docSnap.data();

            return { tweet, Credential, userId, username, photo, id: docSnap.id, }
          }
          setupdateDoc(doc_tweet);
        }
      }

    }

    getDocumentData();

    //  updateDoc 상태는 여전히 초기 상태일 수 있으며, 따라서 undefined일 수 있습니다.
    // , doc_tweet 함수를 실행한 결과를 updateDoc 상태에 저장해야 합니다. 
    //그리고 updateDoc 상태가 업데이트된 후에 tweet 상태를 업데이트하려면, 
    //이 로직을 useEffect 훅 안에 넣어 updateDoc 상태의 변경을 감지하여 처리

    if (typeof updatedoc?.tweet === "string") {
      setTweetText(updatedoc.tweet);
      console.log(tweetText);
    }

    // 도대체 이유를 모르겠네.... 
    console.log("게시판 재렌더링");
  }, [updatedoc?.tweet])



  // 타입이 file인 input이 변경될 때마다 파일의 배열을 받게 됨
  // 파일을 여러 개를 받을 수도 있기 때문에 예외처리 설정
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setFileError("");
      setImagePreviewUrl('');

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

          // 프리뷰
          const reader = new FileReader();

          reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
          };

          reader.readAsDataURL(files[0]);
          setIsUpdateFile(true);
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


  //기존 사진 제거 예정 
  const onExsitingImageRemove = () => {
    // 변경 사진이 있을 시에는 무조건 기존 사진 삭제 예정
    if (!file) {
      setIsUpdateFile((current) => !current);
    }
  }

  //변경 예 사진 제거 
  const onFileRemove = () => {

    setFile(null);
    setImagePreviewUrl(null);

    // 파일 입력 필드 초기화
    // 같은 파일을 재선택 했을 때 업로드가 자동으로 
    //안되도록 하는 기능을 해제
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

  }


  //전송 이벤트 
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    // eslint-disable-next-line no-restricted-globals
    const isConfirm = confirm("업데이트 하시겠습니까?");

    if (!isConfirm || tweetText === "" || tweetText.length > 180) {
      return;
    }

    try {

      setIsLoadingUpdate(true);

      if (typeof doc_id === "string") {
        // firestore 인스턴스와 document 경로를 사용하여 document 참조 생성
        const docRef = doc(db, "tweets", doc_id);

        // document 업데이트
        await updateDoc(docRef, {
          tweet: tweetText,
        });

        //사진 수정 
        if (isUpdateFile) {

          //기존 사진 삭제 
          const docRef = doc(db, "tweets", doc_id);

          await updateDoc(docRef, {
            ["photo"]: deleteField()
          });

          //변경할 사진이 있다면
          if (file) {
            const locationRef = ref(storage, `tweets/${updatedoc?.userId}/${doc_id}`);
            //파일 위치, 파일 데이터
            //파일 업로드에 성공하면 url 등에 정보를 반환 
            const result = await uploadBytes(locationRef, file);
            //url 반환 
            const url = await getDownloadURL(result.ref);

            // document 업데이트
            await updateDoc(docRef, {
              // Photo랑 헷갈리면 안됨
              photo: url,
            });
          }

        }
        navigate("/admin/board");
      }
      setTweetText("");
      setFile(null);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingUpdate(false);
    }

  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid >
        <Row>
          <div className="col" >
            <Card className="shadow border-0" style={{ padding: "20px" }}>

              <Form onSubmit={onSubmit}>
                <FormGroup>
                  <Label for="exampleText">
                    Content
                  </Label>

                  <Input
                    rows={10}
                    maxLength={180}
                    id="exampleText"
                    name="text"
                    type="textarea"
                    value={tweetText}
                    onChange={onChange}
                    // 작성자만 수정이 가능하도록 설정
                    readonly={(user?.uid !== updatedoc?.userId) ? "readonly" : null}
                    required
                  />

                </FormGroup>

                <FormGroup>

                  <Label for="exampleText">
                    Image
                  </Label>
                  {/* updatedoc?.photo!의 타입은 무조건 string임을 통보*/}
                  <ImageCarousel photo={updatedoc?.photo!} />
                </FormGroup>

                {(user?.uid !== updatedoc?.userId) ? null :
                  <>
                    <FormGroup>
                      <Label for="exampleFile">
                        File
                      </Label>

                      <Input
                        id="exampleFile"
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                      />

                      <FormText>
                        This is some placeholder block-level help text for the above input. It‘s a bit lighter and easily wraps to a new line.
                      </FormText>
                      {imagePreviewUrl &&
                        <>
                          <>
                            <Card className="my-2">

                              <CardBody>
                                <CardTitle tag="h1">
                                  변경 이미지
                                </CardTitle>
                              </CardBody>

                              <CardImg
                                alt="Card image cap"
                                src={imagePreviewUrl.toString()}
                                style={{
                                  height: 250
                                }}
                                top
                                width="100%"
                              />

                            </Card>
                          </>
                        </>
                      }

                    </FormGroup>
                    <Button type="submit">
                      {isLoadingUpdate ? "Post Update" : "Update Board"}
                    </Button>

                    <Button color="danger" type="button" onClick={onExsitingImageRemove}  >
                      {!isUpdateFile ? "기존 사진 제거" : "기존 사진 제거 예정"}

                    </Button>

                    {imagePreviewUrl &&
                      <Button color="warning" type="button" onClick={onFileRemove}>
                        변경 이미지 제거
                      </Button>
                    }
                  </>
                }
              </Form>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default BoardDetail;
