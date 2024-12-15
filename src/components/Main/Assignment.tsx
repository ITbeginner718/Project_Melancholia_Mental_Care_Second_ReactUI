import { auth, db } from "@/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardHeader, Row, Table } from "reactstrap";
import AssignmentModal from "./AssignmentModal";

//인터페이스 작성 
export interface ICounselAssignment {
  counselingDate: string;
  Credential: number;
  conuselingFeedback: string; //feedback
  counselingSummary: string; //Summary
  Id: string;
}

export default function ArticleBlog() {

  const user = auth.currentUser;

  // 배열 설정
  const [counselAssignments, setCounselAssignments] = useState<ICounselAssignment[]>([]);

  const [modal, setModal] = useState(false);
  const toggle = () => 
    {
      setModal(!modal);
    }

  const [feedback, setFeedback]=useState("");
  const [summary, setSummary]=useState("");

  const activateModal =(feedback:string, summary:string)=>{
    
    setFeedback(feedback);
    setSummary(summary);

    // 모달 창 실행
    toggle();
  }

  const fetchCounselAssignmentList = async () => {
    // 상담 기록 데이터 불러오기
    const counselQuery = query(collection(db, "counseling"), where("userId", "==", user?.uid), orderBy("Credential", "desc"),);

    const querySnapshot = await getDocs(counselQuery);

    // 값 배열에 저장
    const counselAssignments = querySnapshot.docs.map((document) => {

      const { counselingDate, Credential, conuselingFeedback, counselingSummary } = document.data();

      return {
        counselingDate, Credential, conuselingFeedback, counselingSummary, Id: document.id,
      };
    })

    setCounselAssignments(counselAssignments);

  }

  useEffect(() => {
    // 데이터 불러오기
    fetchCounselAssignmentList();
  }, [])

  return (
    <>          
    <Card className="shadow">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
            <h3 className="mb-0">상담 진행 과제 진행 여부</h3>
          </div>
          <div className="col text-right">
            <Button
              color="primary"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
              size="sm"
            >
              See all
            </Button>
          </div>
        </Row>
      </CardHeader>
      <Table className="align-items-center table-flush" responsive>

        <thead className="thead-light">
          <tr>
            <th scope="col">Credential</th>
            <th scope="col">Date</th>
            <th scope="col" />
          </tr>
        </thead>

        <tbody>
          {counselAssignments && counselAssignments.map((counselAssignment, index) => (
            <>
              <tr key={index}>
                <td onClick={()=> {
                  activateModal(counselAssignment.conuselingFeedback, counselAssignment.counselingSummary);
                }}>  <Link to={""}> {counselAssignment.Credential} </Link> </td>
                <td>{counselAssignment.counselingDate}</td>
                <td />
              </tr>
            </>
          ))}
        </tbody>
      </Table>
    </Card>

    {/* 리스트 안에 모달 창을 넣으면 리스트 갯수 만큼 모달 창이 렌더링되며 이상한 데이터가 작동됨*/}
    {modal && <AssignmentModal  feedback={feedback} summary={summary} onActionClick={toggle}/> }
    </>
  )
}