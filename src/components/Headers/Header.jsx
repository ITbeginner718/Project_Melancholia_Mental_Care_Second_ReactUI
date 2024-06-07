/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {
  // 타이머 설정

  return (
    <>
      <div className="header pb-8 pt-5 pt-md-8  " style={{backgroundColor:"#FFD732"}}>
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          우울증 원인
                        </CardTitle>
                        <Link to="https://youtu.be/UcicbfYeSp4?feature=shared" target="_blank">
                        <span className="h2 font-weight-bold mb-0">
                        우울증의 원인 이해하기
                        </span>
                        </Link>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">media</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          우울증 도움
                        </CardTitle>
                        <Link to="https://brunch.co.kr/@midsumbreath-er/174" target="_blank">
                        <span className="h2 font-weight-bold mb-0">우울증 추천 도서</span>
                        </Link> 
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      
                      <span className="text-nowrap">books</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          우울증 극복
                        </CardTitle>
                        <Link target="_blank" to="https://eemdream.tistory.com/entry/%EC%9A%B0%EC%9A%B8%EC%A6%9D-%EA%B7%B9%EB%B3%B5%EC%A3%BD%EA%B3%A0%EC%8B%B6%EC%97%88%EB%8D%98-%EB%82%B4%EA%B2%8C-%EB%8F%84%EC%9B%80%EC%9D%B4-%EB%90%9C-%EC%9A%B0%EC%9A%B8%EC%A6%9D-%EA%B7%B9%EB%B3%B5%EB%B0%A9%EB%B2%95-7%EA%B0%80%EC%A7%80">
                        <span className="h2 font-weight-bold mb-0">우울증 극복 후기</span>
                        </Link>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">writing</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          우울증 관리
                        </CardTitle>
                        <Link to="https://www.korea.kr/news/healthView.do?newsId=148914226" target="_blank">
                        <span className="h2 font-weight-bold mb-0">우울증 관리 수칙</span>
                        </Link>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      
                      <span className="text-nowrap">media</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
