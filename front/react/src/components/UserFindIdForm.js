import axios from "axios";
import React, {useState} from "react";
import UserFindIdResult from "./UserFindIdResult";
import "../css/UserFindIdForm.css"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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
                <UserFindIdResult userId={userId}/>
            ):(
             <div className="findIdContainer">
                 <br/><br/>
                 <div className="JoinBoxColumn">
                     <h2><b>아이디 찾기</b></h2>
                 </div>
                 <div className="findIdCol">
                     <Form.Control className="boxShadow" id="findIdBox" type="text" placeholder="전화번호를 입력하세요." onChange={onChange}/>
                 </div>
                 <div className="findIdCol">
                     <Button className="boxShadow"  variant="secondary" onClick={findId}>아이디 찾기</Button>
                 </div>
             </div>
            )
            }
        </div>
    )
}

export default UserFindIdForm;