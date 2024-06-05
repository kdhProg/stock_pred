import React, {useState} from 'react';
import axios from "axios";
import "../css/Join.css"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {

    /*
    * Todo 전화번호 인증기능 넣기
    * */

        /* 필수 컬럼 - 아이디, 비밀번호, 전화번호, 닉네임*/
        let isButtonDisabled = true;

        const chkIsEssentialValExists = ()=>{
                if (userJoinReq.userAccount.trim().length !== 0 &&
                    userJoinReq.password.trim().length !== 0 &&
                    userJoinReq.phone.trim().length !== 0 &&
                    userJoinReq.nickName.trim() !== 0) {
                        isButtonDisabled = false;
                } else {
                        isButtonDisabled = true;
                }
        }


        /* request payload */
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
                chkIsEssentialValExists();
                if(isButtonDisabled){
                        alert("아이디 / 비밀번호 / 전화번호 -> 필수!!")
                }else{
                        await axios.post(`/user/join`, userJoinReq)
                            .then(()=>{
                                    alert("회원가입 성공")
                                    window.location.replace("/");
                            })
                            .catch((err) => {
                                    console.log(err.message);
                            })
                }
        };

        return (
            <div className="JoinBoxContainer">
                <br/><br/>
                <div className="JoinBoxColumn">
                    <h2><b>회원가입</b></h2>
                </div>
                <div className="JoinBoxColumn">
                    <b>= 필수 : 아이디 / 패스워드 / 전화번호 / 닉네임 =</b>
                </div>
                <div className="JoinBoxColumn">
                    <Form.Control className="boxShadow" type="text" placeholder="ID" name="userAccount" value={userAccount}
                                  onChange={onChange}/>
                </div>
                <div className="JoinBoxColumn">
                    <Form.Control className="boxShadow" type="text" placeholder="PW" name="password" value={password}
                                  onChange={onChange}/>
                </div>
                <div className="JoinBoxColumn">
                    <Form.Control className="boxShadow" type="text" placeholder="phone" name="phone" value={phone} onChange={onChange}/>
                </div>
                <div className="JoinBoxColumn">
                    <Form.Control className="boxShadow" type="text" placeholder="nickName" name="nickName" value={nickName}
                                  onChange={onChange}/>
                </div>
                <div className="JoinBoxColumn">
                    <b>=== 선택 ===</b>
                </div>
                <div className="JoinBoxColumn">
                    <Form.Control className="boxShadow" type="text" placeholder="address" name="address" value={address} onChange={onChange}/>
                </div>
                <div className="JoinBoxColumn">
                    <Form.Control className="boxShadow" type="text" placeholder="gender" name="gender" value={gender} onChange={onChange}/>
                </div>
                <div className="JoinBoxColumn">
                    <Form.Control className="boxShadow" type="text" placeholder="birth" name="birth" value={birth} onChange={onChange}/>
                </div>
                <div className="JoinBoxColumn">
                    <Form.Control className="boxShadow" type="text" placeholder="nation" name="nation" value={nation} onChange={onChange}/>
                </div>
                <div className="JoinBoxColumn">
                    <Button className="boxShadow" variant="secondary" onClick={submitReq}>Join</Button>
                </div>
            </div>
        );
};

export default Login;