
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle, CardSubtitle, CardText, Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


//인터페이스 작성 
export interface IMainChatbotFeedback {
    ChatbotDate: string;
    feedbackData: string;
    feedbackAddExplain: string;
    userID: string;
    id:string;
}


export default function ChatbotFeedbackList({ ChatbotDate,feedbackData, feedbackAddExplain,userID ,id}: IMainChatbotFeedback) {
    
        //현재 유저값 가져오기 
        const user = auth.currentUser;

        // 모달 state
        const [modal, setModal] = useState(false);

        // 모달 이벤트
        const toggle = () => setModal(!modal);

        const onClickFeedback = () => {
            toggle();
        }

        const onDelete = async () => {
            //정말 삭제 할 것인지 사용자 확인 
            // eslint-disable-next-line no-restricted-globals
            const ok = confirm("Are you sure you want to delete this tweet?");
    
            // 해당 트윗 id와 사용자 id가 다르면 조기 종료(삭제 X) 
            // confirm에서 취소를 눌러도 조기 종료(삭제 X)
            if (!ok || user?.uid !== userID) return;
    
            try {
                // 트윗을 삭제할 문서를 반환
                // 매개변수는 삭제할 문서에 대한 참조
                // 파이어베이스 인스턴스를 넘겨 주기
                // 문서가 저장된 경로
                await deleteDoc(doc(db, "chatbotFeedbacks", id));
    
            } catch (error) {
                console.log(error);
            }
    
            finally {
                //
            }
        }



    return (
        <>
            <tr >
            <Link to={''}><td onClick={onClickFeedback}>{ChatbotDate} </td></Link>
             <td onClick={onClickFeedback}> {feedbackData.length > 7 ? `${feedbackData.substring(0, 7)}...` : feedbackData} </td>
            
             <td>
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

            {/* 결과창  */}
            <Modal isOpen={modal} toggle={toggle} fullscreen="true">
                <ModalHeader toggle={toggle}>꼭 기억해주세요</ModalHeader>
                <ModalBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* :{chatbotFeedback}
                    부가설명:{chatbotFeedbackAddExplain}     */}

                    <Card
                        style={{
                            width: '32rem'
                        }}
                    >
                        <img
                            alt="Sample"
                            src="https://previews.123rf.com/images/halfpoint/halfpoint1308/halfpoint130800063/21957424-%ED%96%89%EB%B3%B5%ED%95%9C-%EA%B0%80%EC%A1%B1.jpg"
                        />
                        <CardBody>
                            <CardTitle tag="h5">
                                기억하기!
                            </CardTitle>
                            <CardSubtitle
                                className="mb-2 text-muted"
                                tag="h6"
                            >
                                Feedback
                            </CardSubtitle>
                            <CardText>
                            {feedbackData}
                            </CardText>

                            <CardSubtitle
                                className="mb-2 text-muted"
                                tag="h6">
                                Feedback_AddExplain
                            </CardSubtitle>
                            <CardText>
                            {feedbackAddExplain}
                            </CardText>
                        </CardBody>
                    </Card>

                </ModalBody>
            </Modal>

        </>
    )
}