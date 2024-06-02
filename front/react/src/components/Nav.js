import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import StockSearchBox from "./StockSearchBox";
import {chkUserSubsPlan} from "../functions/chkUserSubsPlan";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from '../css/Nav.module.css'
import Container from "react-bootstrap/Container";
import Logo from "../assets/logo_noBG.PNG"

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
        <Container className={styles.navBar}>
            <Row>
                <Col md={2} className={`${styles.allColAttribute} ${styles.logoImgLinkCol}`}>
                    <Link className={styles.logoImgLink} to="/">
                        <img className={styles.logoImg} src={Logo} alt="Clickable" style={{cursor: 'pointer'}}/>
                    </Link>
                </Col>
                <Col>
                    {isAuthenticated ? (
                        <Row>
                            <Col className={styles.allColAttribute}>
                                <Link to="/NoticePage">공지사항</Link>
                            </Col>
                            <Col className={styles.allColAttribute}>
                                <Link to="/FreeBoardPage">자유게시판</Link>
                            </Col>
                            <Col md={4} className={`${styles.allColAttribute} ${styles.schBoxStyle}`}>
                                <StockSearchBox/>
                            </Col>
                            <Col className={styles.allColAttribute}>
                                <button className={styles.buttonNormalDesign} onClick={doLogout}>로그아웃</button>
                            </Col>
                            <Col className={`${styles.myPageDesign} ${styles.allColAttribute}`}>
                                <div>
                                    <Link to="/Mypage">마이페이지</Link>
                                </div>
                            </Col>
                            <Col className={`${styles.paidPlanText} ${styles.allColAttribute}`}>
                                {isPaidPlan ?(
                                    <div>
                                        <p>Paid</p>
                                    </div>
                                ):(
                                    <div>
                                        <button  className={styles.buttonNormalDesign} onClick={()=>{navigate("/subscribePage")}}>유료계정</button>
                                    </div>
                                )
                                }
                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <Col>

                            </Col>
                            <Col md={2} className={styles.allColAttribute}>
                                <Link to="/Join">회원가입</Link>
                            </Col>
                            <Col md={2} className={styles.allColAttribute}>
                                <Link to="/login">로그인</Link>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Nav;