import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {updateChoKW} from "../redux/stringSlice";
import {useNavigate} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from '../css/StockSearchPage.module.css'
import Button from "react-bootstrap/Button";


const StockSearchPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* 전역 검색값(문자열 받아오기) */
    const globalKeywordStore = useSelector(state => state.string.schStockKeyword);

    /* 서버로부터 요청 결과 받기*/
    const [schList, setSchList] = useState({});

    /* 검색 요청 */
    const doSearch = async (keyword) => {
        await axios.get(`/pred/stockNameSearch?keyword=${keyword}`)
            .then((response) => {
                    setSchList(response.data)
                }
            )
            .catch((err) => {
                console.log(err.message);
            })
    }

    /* 특정 주식 선택 -> 예측창으로 이동 */
    const choButtonClick = (ticker) => {
        dispatch(updateChoKW(ticker));
        navigate("/predStock")
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                await doSearch(globalKeywordStore);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        return () => {
            // cleanup 작업 수행
        };
    }, [globalKeywordStore]);


    return (
        <div>
            <Container>
                <br/>
                <br/>
                <Row className={styles.schKeywordStyle}>
                    <Col md={4}>
                        <p>검색어 : {globalKeywordStore}</p>
                    </Col>
                    <Col/>
                </Row>
                <br/>
                <Row className={styles.listColumnInfoStyle}>
                    <Col>
                        기업명
                    </Col>
                    <Col>
                        Ticker
                    </Col>
                    <Col>

                    </Col>
                </Row>
                <br/>
                <Row  className={styles.overSpaceScroll}>
                    <Col>
                        {Object.entries(schList).map(([corpName, ticker]) => (
                            <Row className={styles.eachRowStyle}>
                                <Col>
                                    <p>{corpName}</p>
                                </Col>
                                <Col>
                                    <p>{ticker}</p>
                                </Col>
                                <Col>
                                    <Button variant="secondary" className={styles.tickerButton} onClick={() => choButtonClick(ticker)}>선택</Button>
                                </Col>
                            </Row>
                        ))}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default StockSearchPage;