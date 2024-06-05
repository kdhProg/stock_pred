import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from '../legacy/StockSearchPage.module.css'
import Button from "react-bootstrap/Button";
import "../css/StockSearchPage.css"


const StockSearchPage = () => {
    
    /*
    * Todo : 빈 검색어 입력시 감지하여 적절한 문구 띄우기
    * */

    // const dispatch = useDispatch();
    const navigate = useNavigate();

    /* 전역 검색값(문자열 받아오기) */
    // 20240603  전역 redux방식에서 useParams방식으로 변경
    // const globalKeywordStore = useSelector(state => state.string.schStockKeyword);

    /* 키워드 요청 필드 */
    const keyword = useParams().keyword;

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
        // dispatch(updateChoKW(ticker));
        navigate('/predStock/'+ticker)
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                await doSearch(keyword);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        return () => {
            // cleanup 작업 수행
        };
    }, [keyword]);


    return (
        <div className="stockSchPageContainer">
            <br/><br/>
            <div className="stockSchPageColumn">
                <h4><strong>검색어 : {keyword}</strong></h4>
            </div>
            <br/>
            <div className="stockSchPageColumn stockInfoRow">
                <div className="stockInfoColumn">
                    <h4><b>기업명</b></h4>
                </div>
                <div className="stockInfoColumn">
                    <h4><b>Ticker</b></h4>
                </div>
                <div className="stockInfoColumn">
                    <h4><b></b></h4>
                </div>
            </div>
            <br/>
            <div className="stockSchPageColumn stockListsRow">
                {Object.entries(schList).map(([corpName, ticker]) => (
                    <div>
                        <div className="stockEachRow">
                            <div className="stockEachCol">
                                <p>{corpName}</p>
                            </div>
                            <div className="stockEachCol">
                                <p>{ticker}</p>
                            </div>
                            <div className="stockEachCol">
                                <Button variant="secondary" className="chooseBtn" onClick={() => choButtonClick(ticker)}>
                                    <b>선택</b>
                                </Button>
                            </div>
                        </div>
                        <br/>
                    </div>
                ))}
            </div>
            <br/><br/>
        </div>
    )
}

export default StockSearchPage;