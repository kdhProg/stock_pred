import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import StockSearchBox from "./StockSearchBox";
import {chkUserSubsPlan} from "../functions/chkUserSubsPlan";

const Nav = () => {

    const navigate = useNavigate();

    /* 인증되었는지 체크 */
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /* 유료구독회원인지 체크 */
    const [isPaidPlan, setIsPaidPlan] = useState(false);


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





    /*  Todo 마이페이지 만들기 */
    return (
        <div>
            <Link to="/">Home</Link>
            {isAuthenticated ? (
                <span>
                    <StockSearchBox/>
                    <Link to="/logout">Logout</Link>
                    <Link to="/Mypage">Mypage</Link>
                    {isPaidPlan ?(
                        <div>
                            <p>이미 유료계정입니다.</p>
                        </div>
                        ):(
                         <div>
                             <button onClick={()=>{navigate("/subscribePage")}}>유료계정으로전환!</button>
                         </div>
                        )
                    }
                </span>
            ) : (
                <span>
                    <Link to="/Join">Join</Link>
                    <Link to="/login">Login</Link>
                </span>
            )}
        </div>
    );
};

export default Nav;