import { db, auth } from "@/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Button, 
    Card, 
    CardHeader, 
    DropdownItem, 
    DropdownMenu, 
    DropdownToggle, 
    Row,
    Table,
    UncontrolledDropdown,
} from "reactstrap";

//인터페이스 작성 
export interface ICounsel {
    counselingDate: string;
    Credential: number;
    userId:string;
    Id: string;
}


export default function PsychologicalCounseling() {

    const user = auth.currentUser;

    // 배열 설정
    const [counsels, setCounsels] = useState<ICounsel[]>([]);


    const fetchCounselingList = async () => {
        // 상담 기록 데이터 불러오기
        const counselQuery = query(collection(db, "counseling"), where("userId", "==", user?.uid), orderBy("Credential", "desc"),);

        const querySnapshot = await getDocs(counselQuery);

        // 값 배열에 저장
        const counsels = querySnapshot.docs.map((document) => {

            const { counselingDate, Credential,userId } = document.data();

            return {
                counselingDate, Credential, userId,Id: document.id,
            };
        })

        setCounsels(counsels);

    }

    useEffect(() => {
        // 데이터 불러오기
        fetchCounselingList();
    }, [])

    // const onDelete = async () => {
    //     //정말 삭제 할 것인지 사용자 확인 
    //     // eslint-disable-next-line no-restricted-globals
    //     const ok = confirm("Are you sure you want to delete this tweet?");

    //     // 해당 트윗 id와 사용자 id가 다르면 조기 종료(삭제 X) 
    //     // confirm에서 취소를 눌러도 조기 종료(삭제 X)
    //     if (!ok || user?.uid !== userId) return;

    //     try {
    //         // 트윗을 삭제할 문서를 반환
    //         // 매개변수는 삭제할 문서에 대한 참조
    //         // 파이어베이스 인스턴스를 넘겨 주기
    //         // 문서가 저장된 경로
    //         await deleteDoc(doc(db, "tweets", id));
    //         // 만약 사진이 있다면 사진도 같이 삭제
    //         if (photo) {
    //             //이미지 경로
    //             const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
    //             // 이미지 삭제
    //             await deleteObject(photoRef);
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     }

    //     finally {
    //         //
    //     }
    // }
    
    return (
        <>
            <Card className="shadow">
                <CardHeader className="border-0">
                    <Row className="align-items-center">
                        <div className="col">
                            <h3 className="mb-0">심리상담 기록</h3>
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
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>

                        {counsels && counsels.map((counsel) => (
                            <>
                                <tr>
                                    <td><Link to={`/admin/ChatbotCounsel/detail/${counsel.Id}`}> {counsel.Credential}</Link></td>
                                
                                    <td>{counsel.counselingDate}</td>
                                    <td className="text-right">
                        {/* 본인만 작성한 트윗만이 삭제버튼이 보일 수 있도록 설정 */}
                        {/* 작성자 트윗 ID와 게시판 트윗 ID와 비교  */}
                        {user?.uid === counsel.userId ?
                            <UncontrolledDropdown>
                                <DropdownToggle
                                    className="btn-icon-only text-light"
                                    href="#pablo"
                                    role="button"
                                    size="sm"
                                    color=""
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>

                                {/* 수정 및 삭제 */}
                                <DropdownMenu className="dropdown-menu-arrow" right>
                                    <DropdownItem
                                        href="#pablo"
                                        onClick={undefined}>
                                        Delete Counsel
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            : null}
                    </td>
                                </tr>
                            </>
                        ))}
                    </tbody>

                </Table>

            </Card>
        </>

    )
}           