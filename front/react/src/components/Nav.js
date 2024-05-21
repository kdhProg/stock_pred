import {Link} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import StockSearchBox from "./StockSearchBox";

const Nav = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(async () => {
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

    }, []);
    /*  Todo 마이페이지 만들기 */
    return (
        <div>
            <Link to="/">Home</Link>
            {isAuthenticated ? (
                <span>
                    <StockSearchBox/>
                    <Link to="/logout">Logout</Link>
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