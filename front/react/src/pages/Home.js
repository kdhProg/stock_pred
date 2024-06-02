import React, {useEffect, useState} from 'react';
import StockSearchBox from "../components/StockSearchBox";
import {Link} from "react-router-dom";
import {chkIsAuthenticated} from "../functions/chkIsAuthenticated";

const Home = () => {

    /*
    * 로그인 해야 검색가능
    * 
    * */

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
        <div>
            {isAuthenticated?(
                <div>
                    <p>상단의 검색바 이용</p>
                </div>
            ):(
                <div>
                    <p>서비스는 로그인해야 이용가능함!</p>
                    <Link to="/login">로그인</Link>
                </div>
                )}
        </div>
    );
};

export default Home;