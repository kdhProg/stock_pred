import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import StockSearchBox from "./StockSearchBox";
import {chkUserSubsPlan} from "../functions/chkUserSubsPlan";
import Logo from "../assets/logo_noBG.PNG"
import "../css/Nav.css"

const Nav = () => {

    const navigate = useNavigate();

    /* 인증되었는지 체크 */
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /* 유료구독회원인지 체크 */
    const [isPaidPlan, setIsPaidPlan] = useState(false);

    /* logout -> 별도의 페이지에서 이동 */
    const doLogout = async () => {
        await axios.get(`/auth/logout`)
        alert("로그아웃 성공")
        window.location.replace("/");
    };


    useEffect(async () => {
        await axios.get(`/auth/status`)
            .then(async (response) => {
                    if (response.data.authenticated) {
                        setIsAuthenticated(true)
                        const isPaid = await chkUserSubsPlan();
                        setIsPaidPlan(isPaid)
                    }
                }
            )
            .catch((err) => {
                console.log(err.message);
                setIsAuthenticated(false)
            })


    }, []);


    return (
        <div className="navBarContainer">
            <div className="navBarColumn imgBox">
                <Link to="/">
                    <img className="logoImg" src={Logo} alt="Clickable" style={{cursor: 'pointer'}}/>
                </Link>
            </div>
            {isAuthenticated?(
                <div className="navBarColumn authenticated">
                    <div className="authenticatedColumn">
                        <Link to="/NoticePage">공지사항</Link>
                    </div>
                    <div className="authenticatedColumn">
                        <Link to="/FreeBoardPage">자유게시판</Link>
                    </div>
                    <div className="stockSchBox">
                        <StockSearchBox/>
                    </div>
                    <div className="authenticatedColumn">
                        <Link to="/Mypage">마이페이지</Link>
                    </div>
                    {isPaidPlan ? (
                        <div className="authenticatedColumn">
                            유료계정입니다.
                        </div>
                    ) : (
                        <div className="authenticatedColumn paidBtnBox">
                            <button className="paidBtn" onClick={() => {
                                navigate("/subscribePage")
                            }}>유료계정 전환
                            </button>
                        </div>
                    )}
                    <div className="authenticatedColumn">
                        <button className="logoutBtn" onClick={doLogout}>로그아웃</button>
                    </div>
                </div>
            ) : (
                <div className="navBarColumn nonAuthenticated">
                    <div className="nonAuthenticatedColumn">
                    <Link to="/Join">회원가입</Link>
                    </div>
                    <div className="nonAuthenticatedColumn">
                        <Link to="/login">로그인</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nav;