import axios from "axios";
import {useState} from "react";
import UserFindIdResult from "./UserFindIdResult";

const UserFindIdForm = ()=>{

    let inputPhone = '';

    const[userId, setUserId] = useState('');
    const[isIdExists, setIsIdExists] = useState(false);

    const onChange = (event) => {
        inputPhone = event.target.value
    };

    const findId = async () => {

        await axios.post(`/user/findUserByPhone?inputPhone=${inputPhone}`)
            .then((resp) => {
                    if(resp.data.isUserExists){
                        setUserId(resp.data.userAccount);
                        setIsIdExists(true);
                    }else{
                        alert("회원이 존재하지 않습니다.");
                    }
                }
            )
            .catch((err) => {
                console.log(err.message);
            })

    }

    return(
        <div>
            {isIdExists?(
                <div>
                    <UserFindIdResult userId={userId}/>
                </div>
            ):(
             <div>
                 <h1>아이디 찾기</h1>
                 <label htmlFor="findIdBox">전화번호를 입력하세요</label>
                 <input id="findIdBox" type="text" onChange={onChange}/>
                 <button onClick={findId}>아이디 찾기</button>
             </div>
            )
            }
        </div>
    )
}

export default UserFindIdForm;