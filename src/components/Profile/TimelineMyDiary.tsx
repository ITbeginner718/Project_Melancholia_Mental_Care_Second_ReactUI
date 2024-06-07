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
import Diary from "../Diary/Diary";


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


export default function TimelineMyDiary() {

    // 사용자 정보
    const user = auth.currentUser;
  // 배열 설정
  const [diaries, setDiaries] = useState<IDiary[]>([]);

    // 스냅샷
    useEffect(()=>{

    // useEffect는 1번만 실행(사실 1번만 실행되게 했어도 2번 실행)
    let unsubscribe: Unsubscribe | null = null;

          // 사용자가 작성한 tweet만 보여주기
  const fetchDiaries = async () => {
    const diaryQuery = query(
      collection(db, "diaries"),
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
      orderBy("credential", "desc"),
      limit(25),
    );

    // 스냅샷
    unsubscribe = await onSnapshot(diaryQuery/* 쿼리 등록*/, (snapshot) => {
        const diaries = snapshot.docs.map((document) => {
            const { diaryTitle, diaryContent, diaryDate,userID ,credential } = document.data();
      
            return {
              diaryTitle, diaryContent, diaryDate, userID, credential,
              id: document.id,
            };
          }
      
          );

          setDiaries(diaries);
    })

  }

//   함수 호출 
  fetchDiaries();

//  cleanup 함수
  return () => {

    // 타임라인 컴포넌트가 마운트될때 구독
    // 언마운트되면 구독 취소
    //해당 함수가 호출되면 onSnapshot작동이 중지 됨
    unsubscribe && unsubscribe();// => unsubcribe가 참으로 간주되면 unsubscribe()호출된다는 뜻
    console.log("DiaryUnsubcribe called");
}

    },[])
    
    return (
        <>
        <Card className="bg-secondary shadow mt-5">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My Diary</h3>
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
                      <th scope="col">Summary</th>
                      <th scope="col">ID</th>
                      <th scope="col">Date</th>
                      <th scope="col" />
                    </tr>
                  </thead>

                  {/* 일기 리스트 출력 */}
                  {diaries.map((diary) => (
                    <Diary key={diary.id} {...diary} />
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
    );
}