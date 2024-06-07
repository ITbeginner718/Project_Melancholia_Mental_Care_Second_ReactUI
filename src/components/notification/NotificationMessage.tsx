import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle, CardSubtitle, CardText, Card } from 'reactstrap';


//인터페이스 작성 
export interface INotificaiton {
    title: string;
    content: string; //필수가 아니기 때문에 required 아닌 것으로 설정
}

export default function NotificationMessage() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [notification, setNotification] = useState<INotificaiton>();
    // 이미지
    const [image, setImage] = useState("");

    // 모달 state
    const [modal, setModal] = useState(false);

    // 모달 이벤트
    const toggle = () => setModal(!modal);


    useEffect(() => {
        // 데이터 가져오기

        // 특정 문서 ID를 이용하여 데이터를 가져오는 비동기 함수
        async function getDocumentData() {
            //타입이 string인지 체크
            if (typeof id === "string") {
                // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
                const docRef = doc(db, "notifications", id);

                // 참조를 사용하여 문서 정보 가져오기
                const docSnap = await getDoc(docRef);

                // 문서의 존재 여부 확인 및 데이터 출력

                //해당 쿼리에 대한 모든 문서 반환 
                if (docSnap.exists()) {
                    const doc_notification = () => {

                        const { title, content } = docSnap.data();

                        return { title, content}
                    }

                    // 이미지 불러오기
                    const url = await getDownloadURL(ref(storage, `notifications/${id}.png`));
                    console.log(url);   
                    setNotification(doc_notification);
                    setImage(url);      
                }
            }

        }

        //   함수 실행 
        getDocumentData();
    }, [])

    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {

        console.log("notification useEffect 실행")
        if (notification?.title && notification?.content&& image) {
            // 데이터 다 가져오면토글 실행
            console.log("토클전 임지 확인:", image)  
            toggle();
        }

    }, [notification, image]);


    const onClickMainIndex = () => {
        toggle();
        // 메인페이지로 이동
        navigate("/admin/index");
    }

    return (
        <>
            {/* 결과창  */}
            <Modal isOpen={modal} toggle={toggle} fullscreen="true" backdrop="static">
                <ModalHeader toggle={toggle}>꼭 기억해주세요!</ModalHeader>
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
                            src={image}
                        />
                        <CardBody>
                            <CardTitle tag="h5">
                                {notification?.title}
                            </CardTitle>
                            <CardSubtitle
                                className="mb-2 text-muted"
                                tag="h6"
                            >
                                짥고 좋은 말귀
                            </CardSubtitle>
                            <CardText>
                                {notification?.content}
                            </CardText>
                        </CardBody>
                    </Card>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={onClickMainIndex}>
                        메인으로 이동
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </>
    )

}