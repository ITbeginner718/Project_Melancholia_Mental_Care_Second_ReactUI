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
import { FirebaseError } from "firebase/app";
import { auth } from "../../firebase";
import { GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";


import githubLogo from "../../assets/img/icons/common/github.svg";    
import googleLogo from "../../assets/img/icons/common/google.svg"; 

// 로그인 폼까지만 존재 
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //에러 메시지 
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const URL_INDEX = "/admin/index";

  const onChange = (e: React.ChangeEvent<HTMLElement>) => {
    // input의 name값을 이용하여 이벤트 발생 
    // const { target: { name, value }, } = e;
    const { name, value } = e.target as HTMLInputElement;
    //const name= e.target.name;
    //const value= e.target.value; 

    if (name === "email") {
      setEmail(value);
    }

    else if (name === "password") {
      setPassword(value);
    }
  }

  //submit 이벤트가 발생했을 때 
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //기본 동작 해제 
    e.preventDefault();
    //버튼 클릭시 에러 메세지는 우선 삭제 
    setError("");

    //로딩중, 이메일 공백, 비밀번호 공백 
    if (isLoading || email === "" || password === "") return;

    // 계정 생성 
    try {
      setIsLoading(true);
      //로그인 되어 있는 상태인지 체크 
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/index");
    }
    catch (e) {
      if (e instanceof FirebaseError) {
        // 예시 (이미 등록된 email)
        // e.code: auth/email-already-in-use
        // e.message: Firebase: Error (auth/email-already-in-use).
        console.log(e.code, e.message);
        setError(e.message);
      }
      //예외 처리 

    }

    finally {
      setIsLoading(false);
    }
    // 사용자 프로필의 이름을 지정 
    // 홈페이지로 리다이렉션

    console.log(email, password);
  }

        // -------------------------- 소셜 로그인 --------------------------------
    
    // 깃허브 
    const onClickGithub = async () => {
      try {
          //무조건 firebase/auth 이걸로 해야 함 
          const provider = new GithubAuthProvider();
          // 팝업 창을 이용하여 로그인

          //현재 리다이렉션으로 하면 에러 발생 
          // await signInWithRedirect(auth, provider);
          await signInWithPopup(auth, provider);

          //home으로 이동 
          navigate(URL_INDEX);
      } 
      
      catch (error) {
          console.error(error);
      }
  }

  // 구글
  const onClickGoogle = async () => {
    try {
        //무조건 firebase/auth 이걸로 해야 함 
        const provider = new GoogleAuthProvider();
        // 팝업 창을 이용하여 로그인

        //현재 리다이렉션으로 하면 에러 발생 
        // await signInWithRedirect(auth, provider);
        await signInWithPopup(auth, provider);

        //home으로 이동 
        navigate(URL_INDEX);
    }
    catch (error) {
        console.error(error);
    }
}

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={onClickGithub}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      githubLogo
                    }
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={onClickGoogle}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      googleLogo
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
            <Form role="form" onSubmit={onSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    onChange={onChange} name="email" value={email} placeholder="email" type="email" required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    onChange={onChange} name="password" value={password} placeholder="password" type="password" required
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
