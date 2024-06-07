import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/Admin";
import AuthLayout from "./layouts/Auth";

import ProtectedRoute from "./components/protected_route.tsx";
import { auth} from "./firebase.ts";
import LoadingScreen from "./components/loading_screen.tsx";

export default function App() {

    const [isLoading, setIsLoading] = useState(true);

    //로그인 화면 
    const init = async () => {
        // 인증 상태가 준비되었는지를 기다림 
        // 최초 인증 상태가 완료될 때 실행해오는 Promise을 return 
        // firebase가 쿠키와 토큰을 읽고 백엔드와 소통해서 로그인 여부를 확인하는 동안 대기 
        await auth.authStateReady();

        setIsLoading(false);
    };

    useEffect(() => {
        init();
    }, []);

    return (
        // 부모 태그가 무조건 있어야 함
        <>
            {isLoading ? <LoadingScreen /> :
                <BrowserRouter>
                    <Routes>
                        {/* 로그인에 성공하면 해당 페이지로 이동*/}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/admin/*" element={<AdminLayout />}>
                            </Route>
                            {/* 일치하는 경로가 없을 때 사용자를 /admin/index로 리디렉션 */}
                            <Route path="*" element={<Navigate to="/admin/index" replace />} />
                        </Route>
                        <Route path="/auth/*" element={<AuthLayout />} />
                    </Routes>
                </BrowserRouter>
            }
        </>
    );
}