import React, {useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

    const [loginReq, setLoginReq] = useState({
        userAccount: '',
        password: '',
    });

    const { userAccount, password } = loginReq;

    const onChange = (event) => {
        const { value, name } = event.target;
        setLoginReq({
            ...loginReq,
            [name]: value,
        });
    };

    const doLogin = async () => {
        await axios.post(`/auth/login`, loginReq)
            .then((response) =>
                navigate('/')
            )
            .catch((err) => {
                console.log(err.message);
            })

    };




    return (
        <div>
            <input type="text" placeholder="ID" name="userAccount" value={userAccount} onChange={onChange}/>
            <input type="text" placeholder="PW" name="password" value={password} onChange={onChange}/>
            <button onClick={doLogin}>Login</button>
        </div>
    );
};

export default Login;