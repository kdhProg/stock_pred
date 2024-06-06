import axios from "axios";
import {useEffect, useState} from "react";
import UserInfoChangeForm from "../components/UserInfoChangeForm";

const Mypage = ()=>{

    const [curUser, setCurUser] = useState('');

    /*
    * Todo 현재 User정보 가져오는 함수 별도의 JS로 분리하기
    * */
    const getUserInfo = async () => {
        await axios.get(`/user/currentUserAccount`)
            .then((response) =>{
                setCurUser(response.data);
                }
            )
            .catch((err) => {
                console.log(err.message);
            })

    };


    useEffect(() => {
        getUserInfo()
    }, []);


    return(
        <div className="MPContainer">
            <br/><br/>
            <div className="MPIntroRow">
                <h1>마이페이지</h1>
            </div>
            <div className="MPCurrentUserRow">
                <h2>현재 사용자 : {curUser}</h2>
            </div>
            <div className="MPUserInfoChangeFormRow">
                <UserInfoChangeForm/>
            </div>
        </div>
    )
}

export default Mypage;