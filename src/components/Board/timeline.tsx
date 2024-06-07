import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Unsubscribe } from "firebase/database";
import Board from "./board";

//인터페이스 작성 
export interface ITweet {
    id: string;
    photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
    username: string;
    userId: string;
    tweet: string;
    Credential: number;
}

export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);
    //변수의 타입:Unsubscribe 또는 null로 설정

    useEffect(() => {
        // useEffect는 1번만 실행(사실 1번만 실행되게 했어도 2번 실행)
        let unsubscribe: Unsubscribe | null = null;

        const fetchTweets = async () => {
            //Query 쿼리문
            const tweetQuery = query(
                collection(db, "tweets"),
                //쿼리 Credential 필드를 기준으로 내림차순
                orderBy("Credential", "desc"),
                // 게시물을 3개만 불러오도록 실행
                limit(25),
            );

            // document가져오기 
            // snapshot:특정 시간(시점)에 데이터 저장 장치(스토리지)의 파일 시스템을 포착해 별도의 파일이나 이미지로 저장, 보관하는 기술
            // getDocs하고 getDoc 다름 
            // const snapshot = await getDocs(tweetQuery);
            // //tweet에 있는 document들을 가져오는 것
            // //tweet을 tweets state에 저장 
            // //map은 map내의 함수에서 반환한 항목을 가지고 배열을 생성
            // // 
            // const tweets = snapshot.docs.map((doc) => {
            //     const { tweet, Credential, userId, username, photo } = doc.data();
            //     return {
            //         tweet, Credential, userId, username, photo,
            //         id: doc.id,
            //     }
            // });

            //실시간 트윗
            //쿼리에 리스너를 추가하는 것 
            //리스너가 발동되면 해당 쿼리를 추가 
            //무언가가 삭제, 편집, 생성되면 알림을 받으면서 해당 쿼리의 문서를 보면서 필요한 정보를 제공 
            // onSnapshot 함수는 매번 기능이 성공적으로 실행되면 unsubcribe(구독 취소)함수를 반환
            // 페이지 이동이나 장시간 자리를 비우면 snapshot(리스너 감지 기능)을 해제 시켜야 함
            unsubscribe = await onSnapshot(tweetQuery/* 쿼리 등록*/, (snapshot) => {
                //해당 쿼리에 대한 모든 문서 반환 
                const tweets = snapshot.docs.map(
                    // 모든 문서를 배열에 반환 
                    (doc) => {
                        const { tweet, Credential, userId, username, photo } = doc.data();
                        return {
                            tweet, Credential, userId, username, photo,
                            id: doc.id,
                        }
                    }
                );
                
                //다시 재 등록
                setTweet(tweets);
            })
        }

        fetchTweets();

        return () => {

            // 타임라인 컴포넌트가 마운트될때 구독
            // 언마운트되면 구독 취소
            //해당 함수가 호출되면 onSnapshot작동이 중지 됨
            unsubscribe && unsubscribe();// => unsubcribe가 참으로 간주되면 unsubscribe()호출된다는 뜻
            console.log("unsubcribe");
        }

    }, []);

    return (
        <>
            {
                tweets.map((tweet) => (<Board key={tweet.id} {...tweet} />)) //나머지 데이터는 {...tweet}
                // 같은 것 =>  tweets.map((tweet) =>{ return <Tweet key={tweet.id} {...tweet} />})
            }
        </>
    );
}