import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import StockSearchBox from "./StockSearchBox";

const Nav = () => {

    const navigate = useNavigate();

    /* 인증되었는지 체크 */
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /* 유료구독회원인지 체크 */
    const [isPaidPlan, setIsPaidPlan] = useState(false);








    useEffect(async () => {
        /* Todo 현재 인증여부하는 메서드 분리하기 */
        await axios.get(`/auth/status`)
            .then((response) =>{
                    if(response.data.authenticated){
                        setIsAuthenticated(true)
                    }
                }
            )
            .catch((err) => {
                console.log(err.message);
                setIsAuthenticated(false)
            })

        /* 현재 사용자 구독여부 체크  무료:0  유료:1 */
        /* Todo 구독여부 체크 메서드 분리하기 */
        await axios.get(`/user/currentUserPlan`)
            .then((resp) => {
                    if(resp.data === 1){
                        setIsPaidPlan(true)
                    }
                }
            )
            .catch((err) => {
                console.log(err)
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