import {useNavigate} from "react-router-dom";
import "../css/UserFindIdResult.css"
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const UserFindIdResult = (props)=>{

    const navigate = useNavigate();

    /*
    *
    * Todo 비밀번호 찾기 만들기
    * */

    return(
        <div className="findIdRstContainer">
            <br/><br/>
            <div className="findIdRstCol">
                <h2><b>아이디 찾기 결과</b></h2>
            </div>
            <div className="findIdRstCol">
                <div>
                    <strong className="foundId">{props.userId}</strong>
                </div>
            </div>
            <div className="findIdRstCol findPwNloginBtnRow">
                <div>
                    <Button className="boxShadow" variant="secondary" onClick={() => {
                        navigate("/login")
                    }}>로그인하기
                    </Button>
                </div>
                <div>
                    <Button className="boxShadow" variant="secondary">비밀번호 찾기</Button>
                </div>
            </div>
            <br/><br/>
        </div>
    )
}

export default UserFindIdResult;