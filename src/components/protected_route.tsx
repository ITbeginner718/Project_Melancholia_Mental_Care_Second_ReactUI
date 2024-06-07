//로그인 된 사용자는 protected-route로 이동하며 
//로그인 되지 않는 사용자는 로그인 또는 계정 생성 페이지로 리디렉션될 것 

import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase";

// Protected Route: firebase에게 로그인한 사용자가 누구인지 물어보는 route
export default function ProtectedRoute(props:any)
     {
    //파이어 베이스에서 로그인 했는지 알려줌 
    //로그인 중이면 user를 넘겨 주고
    //아니면 null을 반환 
    const user = auth.currentUser;
    
    console.log(user);
    //로그인을 안했으면 login창으로 이동 
    if(user === null){
        // 컴포넌트를 렌더링하는 것만으로 다른 경로로의 이동을 실행할 수 있습니다.
        // Navigate 컴포넌트는 주로 컴포넌트 트리 내에서 조건부로 다른 경로로 리다이렉션해야 할 때 사용
        // 리다이렉션: 사용자가 처음 요청한 URL이 아닌, 다른 URL로 보내는 것을 뜻
        return <Navigate to ="/auth/login"/>
    }

    //로그인 했으면
    return <Outlet/>;
}