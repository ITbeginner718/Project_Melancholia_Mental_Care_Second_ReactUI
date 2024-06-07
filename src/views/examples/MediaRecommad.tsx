
// reactstrap components
import {
    Card,
    CardHeader,
    Container,
    Row,
    Col,
} from "reactstrap";

// core components
import Header from "../../components/Headers/Header.jsx";
import Timeline from "../../components/Board/timeline";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MediaModalFullscreen from "../../components/MediaRecommand/MediaModal";


interface Id {
    id : string,
  }

const Diary = () => {

    const { id } = useParams();

    //페이지 이동 시 
    useEffect(() => {
        // 페이지를 떠나기 전에 확인 요청
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const message = "정말 이 페이지를 떠나시겠습니까?";
            e.returnValue = message; // Chrome에서 필요
            return message; // 다른 브라우저에서 필요
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); // 빈 의존성 배열을 사용해서 컴포넌트 마운트 시에만 이벤트 리스너를 추가하고, 언마운트 시에 제거

    
    return (
        <>
                {/* 헤더 */}
                <Header />
                {/* 게시판 작성 페이지*/}
                <Container className="mt--7" fluid>
                    {/* Table */}

                    <Row>
                        <div className="col">
                            <Card className="shadow">

                                {/* 끝에 배치 */}
                                <CardHeader className="border-0">
                                    <h3 className="mb-0">위로 받을 수 있는 공간</h3>

                                    <Col style={{ borderBottom: "1px solid #CCC", margin: "10px 0" }}></Col>
                                    
                                    {/* 컴포넌트에 속성 넘겨주기 */}
                                    {id && <MediaModalFullscreen id={id as string} />} 
                                   
                                </CardHeader>
                            </Card>
                        </div>
                    </Row>
                </Container>
        </>
    );
};

export default Diary;
