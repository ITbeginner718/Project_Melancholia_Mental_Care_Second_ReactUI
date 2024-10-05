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
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
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

const Register = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //에러 메시지 
  const [error, setError] = useState("");

  const URL_INDEX = "/admin/index";

  // 이름, 이메일,비밀번호 입력
  const onChange = (e: React.ChangeEvent<HTMLElement>) => {
    //input의 name값을 이용하여 이벤트 발생 
    // const { target: { name, value }, } = e;
    const { name, value } = e.target as HTMLInputElement;

    if (name === "name") {
      setName(value);
    }

    else if (name === "email") {
      setEmail(value);
    }

    else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //버튼 클릭시 에러 메세지는 우선 삭제 

    setError("");

    if (isLoading || name === "" || email === "" || password === "") return;

    try {
      setIsLoading(true);

      //email하고 password를 이용해서 사용자 생성
      //await는 async에서만 사용이 가능  
      //성공하면 자격 증명(회원가입)을 받게 되고 사용자는 앱에 바로 로그인 되게 함 
      //실패하는 경우: (계정이 이미 존재하거나 패스워드가 유효하지 않은 경우)
      const credentials = await createUserWithEmailAndPassword(auth, email, password); //해당 정보로 회원가입 요청 

      //바로 정보를 얻을 수 있음 
      console.log(credentials.user);


      //파이어베이스는 작은 아바타 이미지의 url을 가지는 미니 프로필을 가지게 됌
      //계정을 만든 후 사용자 이름을 설정하는 것

      await updateProfile(credentials.user, {
        displayName: name,
      });

      //게정을 만들고, 사용자 프로필을 업데이트 한 후에 자동으로 로그인 되면서 메인페이지로 이동
      navigate(URL_INDEX);
    }

    catch (e) {

      if (e instanceof FirebaseError) {
        // 예시 (이미 등록된 email)
        // e.code: auth/email-already-in-use
        // e.message: Firebase: Error (auth/email-already-in-use).
        console.log(e.code, e.message);
        setError(e.message);
      }

    }

    finally {
      setIsLoading(false);
    }

    // 사용자 프로필의 이름을 지정 
    // 홈페이지로 리다이렉션
    console.log(name, email, password);
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
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>소셜 로그인</small>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon mr-4"
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
              <small>회원 정보를 입력해주세요.</small>
            </div>
            <Form role="form" onSubmit={onSubmit}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input onChange={onChange} name="name" placeholder="Name" autoComplete="off" type="text" value={name} required />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    onChange={onChange}
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    autoComplete="off"
                    required
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
                    onChange={onChange}
                    name="password"
                    placeholder="Password"
                    type="password"
                    autoComplete="off"
                    value={password}
                    required
                  />
                </InputGroup>
              </FormGroup>
              
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
