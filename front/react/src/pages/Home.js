import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {chkIsAuthenticated} from "../functions/chkIsAuthenticated";
import "../css/Home.css"

const Home = () => {

    /*
    * 로그인 해야 검색가능
    * 
    * */
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');

    const handleButtonClick = () => {
        navigate('/schStock/'+inputValue)
    };

    /* 인증되었는지 체크 */
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            const result = await chkIsAuthenticated();
            setIsAuthenticated(result);
        };

        checkAuthentication();
    }, []);


    return (
        <div className="homeContainer">
            <div className="homeAuthRow">
                <div className="homeAuthTextNBtnColumn">
                    <br/><br/><br/><br/>
                    <div className="homeAuthSubTextRow">
                        <b className="homeAuthSubTextValue">원하는 주식 예측하기</b>
                    </div>
                    <br/>
                    <div className="homeAuthMainTextRow">
                        <b className="homeAuthMainTextValue">StockPredict</b>
                    </div>
                    <br/>
                    <div className="homeAuthRecommandBtnRow">
                        {isAuthenticated ? (
                            <div className="homeAuthRecommandBtnWrapper">
                                <input
                                    className="homeAuthSchBox"
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="기업명 또는 Ticker"
                                />
                                    <button className="homeAuthSchBoxBtn" onClick={handleButtonClick}>
                                <p className="homeAuthSchBoxText">검색</p>
                            </button>
                            </div>
                        ) : (
                            <button className="homeNonAuthLoginBtn" onClick={() => {
                                navigate("/login")
                            }}>로그인
                            </button>
                        )
                        }
                    </div>
                </div>
                <div className="homeAuthAdditionalDescriptionColumn">
                    <br/><br/><br/><br/>
                    <div className="homeAuthAddDesWrapper">
                        {/*<p>#1 LSTM : </p>*/}
                        {/*<p>#2 GRU : </p>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;