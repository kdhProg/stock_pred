import React, { useState } from 'react';
import axios from "axios";

const Login = () => {

    /*
    * Todo 전화번호 인증기능 넣기
    * Todo 필수값 넣지 않으면 버튼 비활성화
    * */

        const [userJoinReq, setUserJoinReq] = useState({
                userAccount: '',
                password: '',
                address:'',
                phone:'',
                gender:'',
                nickName:'',
                birth:'',
                nation:'',
        });

        const { userAccount, password,address , phone
        ,gender ,nickName ,birth ,nation   } = userJoinReq;

        const onChange = (event) => {
                const { value, name } = event.target;
                setUserJoinReq({
                        ...userJoinReq,
                        [name]: value,
                });
        };

        const submitReq = async () => {
            await axios.post(`/user/join`, userJoinReq)
                .then(()=>{
                    alert("회원가입 성공")
                    window.location.replace("/");
                })
                .catch((err) => {
                    console.log(err.message);
                })
        };

        return (
            <div>
                <h1>회원가입</h1>
                <p>필수</p>
                <input type="text" placeholder="ID" name="userAccount" value={userAccount} onChange={onChange}/>
                <input type="text" placeholder="PW" name="password" value={password} onChange={onChange}/>
                <input type="text" placeholder="phone" name="phone" value={phone} onChange={onChange}/>
                <br/>
                <br/>
                <p>선택</p>
                <input type="text" placeholder="address" name="address" value={address} onChange={onChange}/>
                <input type="text" placeholder="gender" name="gender" value={gender} onChange={onChange}/>
                <input type="text" placeholder="nickName" name="nickName" value={nickName} onChange={onChange}/>
                <input type="text" placeholder="birth" name="birth" value={birth} onChange={onChange}/>
                <input type="text" placeholder="nation" name="nation" value={nation} onChange={onChange}/>
                <br/>
                <button onClick={submitReq}>Join</button>
            </div>
        );
};

export default Login;