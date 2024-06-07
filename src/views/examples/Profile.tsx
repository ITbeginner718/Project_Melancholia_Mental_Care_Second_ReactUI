
// core components
import UserHeader from "../../components/Headers/UserHeader.jsx";
import { auth } from "../../firebase";
import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  Container,
  Row,
  Button,

  Col,
  CardBody,
} from "reactstrap";

import TimelineMyBoard from "../../components/Profile/TimelineMyBoard";
import TimelineMyDiary from "../../components/Profile/TimelineMyDiary";
import TimelineMyDiagnose from "../../components/Profile/TimelineMyDianose";

// 이미지

//인터페이스 작성 
export interface ITweet {
  id: string;
  photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
  username: string;
  userId: string;
  tweet: string;
  Credential: number;
}


//인터페이스 작성 
export interface IDiary {
  // photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
  diaryTitle: string;
  diaryContent: string;
  diaryDate: string;
  id: string;
  userID?: string;  //무조건 사용되는 것 아님
  credential?: number; //무조건 사용되는 것 아님
  feeling?: string; //무조건 사용되는 것 아님

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

const Profile = () => {
  const user = auth.currentUser;
  // 프로필 이미지 초기값을 uesr에서 가져온 PhtoURL로 설정
  const [avatar, setAvatar] = useState(user?.photoURL);

  const [nickName, setNickName] = useState(user?.displayName);

  const [updateNickName, setUpdateNickName] = useState("");

  const [isUpdateNickName, setIsUpdateNickName] = useState(false);
  
  useEffect(()=>{},[
console.log(avatar)
  ])

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            {/* 프로필 */}
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      {avatar? <img
                        alt="..."
                        className="rounded-circle"
                        // avatart가 null 타입을 포함하고 있기 때문에 null을 허용하지 않는 src에 값을 할당하면 에러가 발생
                        // es6논리 연산자를 이용해서 null이 아닐때만 값을 할당하고 그렇지 않을경우 "" 빈문자열을 할당 
                        src={avatar || '' }
                      /> : <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>}

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
                    {user?.displayName}
                    <span className="font-weight-light">, 25</span>
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


          {/* 내정보 */}
          <Col className="order-xl-1" xl="8">

            {/* 기억 공유 게시판 */}
            <TimelineMyBoard />

            {/* 일기 */}
            <TimelineMyDiary />

            {/* 진단 검사 */}
            <TimelineMyDiagnose />

          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
