import {Link} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import axios from "axios";

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
            </div>
        </div>
    );
};

export default Nav;