
import { Link } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { ITweet } from "./timeline";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import {
    Badge,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Progress,
    Table,
    UncontrolledTooltip,
} from "reactstrap";


export default function Board({ username, photo, tweet, userId, id, Credential }: ITweet) {
    //현재 유저값 가져오기 
    const user = auth.currentUser;


    const onDelete = async () => {
        //정말 삭제 할 것인지 사용자 확인 
        // eslint-disable-next-line no-restricted-globals
        const ok = confirm("Are you sure you want to delete this tweet?");

        // 해당 트윗 id와 사용자 id가 다르면 조기 종료(삭제 X) 
        // confirm에서 취소를 눌러도 조기 종료(삭제 X)
        if (!ok || user?.uid !== userId) return;

        try {
            // 트윗을 삭제할 문서를 반환
            // 매개변수는 삭제할 문서에 대한 참조
            // 파이어베이스 인스턴스를 넘겨 주기
            // 문서가 저장된 경로
            await deleteDoc(doc(db, "tweets", id));
            // 만약 사진이 있다면 사진도 같이 삭제
            if (photo) {
                //이미지 경로
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                // 이미지 삭제
                await deleteObject(photoRef);
            }

        } catch (error) {
            console.log(error);
        }

        finally {
            //
        }
    }

    return (
        <>
            <tbody>
                <tr>
                    <th scope="row">
                        {/* 게시판 요약 */}
                        {/* 절대 경로 */}
                        <Link to={`/admin/board/detail/${id}`}>
                            <Media className="align-items-center">
                                <Media>
                                    <span className="mb-0 text-sm">
                                        {tweet.length > 7 ? `${tweet.substring(0, 7)}...` : tweet}
                                    </span>
                                </Media>
                            </Media>
                        </Link>
                    </th>

                    {/* 게시판 ID */}
                    <td>{Credential}</td>

                    {/* UserName */}
                    <td>
                        <Badge color="" className="badge-dot mr-4">
                            {username}
                        </Badge>
                    </td>

                    <td className="text-right">
                        {/* 본인만 작성한 트윗만이 삭제버튼이 보일 수 있도록 설정 */}
                        {/* 작성자 트윗 ID와 게시판 트윗 ID와 비교  */}
                        {user?.uid === userId ?
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
