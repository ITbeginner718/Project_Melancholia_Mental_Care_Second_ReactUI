
import Board from "../Board/board";
import { Unsubscribe, collection,  limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
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


//인터페이스 작성 
export interface ITweet {
    id: string;
    photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
    username: string;
    userId: string;
    tweet: string;
    Credential: number;
}


export default function TimelineMyBoard() {
    // 사용자 정보
    const user = auth.currentUser;

    // 배열 설정
    const [tweets, setTweets] = useState<ITweet[]>([]);

    useEffect(() => {

        // useEffect는 1번만 실행(사실 1번만 실행되게 했어도 2번 실행)
        let unsubscribe: Unsubscribe | null = null;

        // 사용자가 작성한 tweet만 보여주기
        const fetchTweets = async () => {
            const tweetQuery = query(
                collection(db, "tweets"),
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
                orderBy("Credential", "desc"),
                limit(25),
            );
            // 해당 쿼리 명령대로 값 import
            // const snapshot = await getDocs(tweetQuery);
            unsubscribe = await onSnapshot(tweetQuery/* 쿼리 등록*/, (snapshot) => {
                // 값 배열에 저장
                const tweets = snapshot.docs.map(
                    (document) => {
                        const { tweet, Credential, userId, username, photo } = document.data();

                        return {
                            tweet, Credential, userId, username, photo,
                            id: document.id,
                        };
                    }

                );

                setTweets(tweets);
            })
        }

        fetchTweets();

        
        return () => {

            // 타임라인 컴포넌트가 마운트될때 구독
            // 언마운트되면 구독 취소
            //해당 함수가 호출되면 onSnapshot작동이 중지 됨
            unsubscribe && unsubscribe();// => unsubcribe가 참으로 간주되면 unsubscribe()호출된다는 뜻
            console.log("boardUnsubcribe called");
        }
        
    }, [])

    return (
        <>
            <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                            <h3 className="mb-0">My Memory Board</h3>
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
                                <th scope="col">Name</th>
                                <th scope="col" />
                            </tr>
                        </thead>

                        {/* 게시판 리스트 출력 */}
                        {
                            tweets.map((tweet) => (<Board key={tweet.id} {...tweet} />)) //나머지 데이터는 {...tweet}
                            // 같은 것 =>  tweets.map((tweet) =>{ return <Tweet key={tweet.id} {...tweet} />})
                        }

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