import {Link, Route, Routes} from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import Logout from "../components/Logout";
import Join from "../components/Join";
import React, { useState, useEffect } from 'react';
import axios from "axios";

const Header = () => {

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
        <header>
            <div>
                <Link to="/">Home</Link>
                {isAuthenticated ? (
                    <div>
                        <Link to="/logout">Logout</Link>
                    </div>
                ) : (
                    <div>
                        <Link to="/Join">Join</Link>
                        <Link to="/login">Login</Link>
                    </div>
                )}
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/Join" element={<Join/>}/>
                </Routes>
            </div>
        </header>
    );
};

export default Header;