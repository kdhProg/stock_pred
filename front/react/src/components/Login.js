import React, {useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../css/Login.css"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {


    const navigate = useNavigate();

    /* 서버 요청용 객체 */
    const [loginReq, setLoginReq] = useState({
        userAccount: '',
        password: '',
    });

    const { userAccount, password } = loginReq;

    /* input값 변화 반영 */
    const onChange = (event) => {
        const { value, name } = event.target;
        setLoginReq({
            ...loginReq,
            [name]: value,
        });
    };

    /*
    * Todo 로그인 실패 시 로직 작성하기
    * 
    * */
    const doLogin = async () => {
        await axios.post(`/auth/login`, loginReq)
            .then((response) =>{
                    alert("로그인 성공")
                    window.location.replace("/");
            }
            )
            .catch((err) => {
                console.log(err.message);
            })

    };


    const findId = ()=>{
        navigate("/UserFindIdForm")
    }


    return (
        <div className="loginBoxContainer">
            <br/><br/>
            <div className="loginBoxColumn">
                <h2><b>로그인</b></h2>
            </div>
            <div className="loginBoxColumn">
                <Form.Control className="boxShadow" type="text" placeholder="ID" name="userAccount" value={userAccount} onChange={onChange}/>
            </div>
            <div className="loginBoxColumn">
                <Form.Control className="boxShadow" type="text" placeholder="PW" name="password" value={password} onChange={onChange}/>
            </div>
            <div className="loginBoxColumn loginBtn">
                <Button variant="secondary" className="boxShadow" onClick={doLogin}>Login</Button>
            </div>
            <div className="loginBoxColumn findIdNfindPwRow">
                <div>
                    <Button className="boxShadow" variant="secondary" onClick={findId}>아이디 찾기</Button>
                </div>
                <div>
                    <Button className="boxShadow" variant="secondary">비밀번호 찾기</Button>
                </div>
            </div>
            <br/><br/>
        </div>
    );
};

export default Login;