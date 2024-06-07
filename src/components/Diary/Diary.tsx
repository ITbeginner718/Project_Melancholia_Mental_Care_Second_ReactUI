import { Link, useNavigate } from "react-router-dom";
import { IDiary } from "../../views/examples/Profile";
import {
    Badge,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
} from "reactstrap";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";

export default function Diary({ id, diaryTitle, diaryDate, diaryContent, userID, credential }: IDiary) {
    //현재 유저값 가져오기 
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = useState(false);



    const onDelete = async () => {

        //정말 삭제 할 것인지 사용자 확인 

        // eslint-disable-next-line no-restricted-globals
        const ok = confirm("해당 일기를 삭제 하겠습니까?");

        // 해당 트윗 id와 사용자 id가 다르면 조기 종료(삭제 X) 
        // confirm에서 취소를 눌러도 조기 종료(삭제 X)
        if (!ok) {
            return;
        }

        try {
            // 트윗을 삭제할 문서를 반환
            // 매개변수는 삭제할 문서에 대한 참조
            // 파이어베이스 인스턴스를 넘겨 주기
            // 문서가 저장된 경로
            if (typeof id === "string") {
                console.log({ id });
                await deleteDoc(doc(db, "diaries", id));
            }

        } catch (error) {
            console.log(error);
        }

        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <tbody>
                <tr>
                    <th scope="row">
                        {/* 게시판 요약 */}
                        {/* 절대 경로 */}
                        <Link to={`/admin/diary/detail/${id}`}>
                            <Media className="align-items-center">
                                <Media>
                                    <span className="mb-0 text-sm">
                                        {diaryTitle}
                                    </span>
                                </Media>
                            </Media>
                        </Link>
                    </th>

                    <Link to={`/admin/diary/detail/${id}`}>
                    {/* 게시판 ID */}
                    <td>{credential}</td>
                    </Link>
                    {/* UserName */}
                    <td>
                        <Badge color="" className="badge-dot mr-4">
                            {diaryDate}
                        </Badge>
                    </td>

                    <td className="text-right">
                        {/* 본인만 작성한 트윗만이 삭제버튼이 보일 수 있도록 설정 */}
                        {/* 작성자 트윗 ID와 게시판 트윗 ID와 비교  */}
                        {user?.uid === userID ?
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
                                        onClick={onDelete}>
                                        Delete Board
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            : null}
                    </td>
                </tr>
            </tbody>
        </>
    )
}