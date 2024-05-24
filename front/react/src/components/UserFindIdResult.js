import {useNavigate} from "react-router-dom";

const UserFindIdResult = (props)=>{

    const navigate = useNavigate();

    /*
    *
    * Todo 비밀번호 찾기 만들기
    * */

    return(
        <div>
            <h3>아이디 찾기 결과</h3>
            <p>{props.userId}</p>
            <button onClick={()=>{navigate("/login")}}>로그인하기</button>
            <button>비밀번호 찾기</button>
        </div>
    )
}

export default UserFindIdResult;