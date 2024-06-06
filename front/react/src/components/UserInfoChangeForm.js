import axios from "axios";
import { useEffect, useState } from "react";
import "../css/UserInfoChangeForm.css"
import Button from "react-bootstrap/Button";

const UserInfoChangeForm = () => {

    /* 필수 컬럼 - 아이디, 비밀번호, 전화번호 */
    let isButtonDisabled = true;

    const chkIsEssentialValExists = ()=>{
        if (proUpdReq.userAccount.trim().length !== 0 &&
            proUpdReq.phone.trim().length !== 0 &&
            proUpdReq.nickName.trim().length !== 0) {
            isButtonDisabled = false;
        } else {
            isButtonDisabled = true;
        }
    }

    /* userProfile 받는 변수 */
    const [curUserProfile, setCurUserProfile] = useState({});

    /* 현재 사용자 아이디 */
    const [curUser, setCurUser] = useState('');

    /* 로딩 상태 변수 */
    const [isLoading, setIsLoading] = useState(true);

    /*
     * Todo 현재 User정보 가져오는 함수 별도의 JS로 분리하기
     * */
    const getUserAccount = async () => {
        try {
            const response = await axios.get(`/user/currentUserAccount`);
            setCurUser(response.data);
        } catch (err) {
            console.log(err.message);
        }
    };

    /*
     * Todo
     *  - address에 주소API 연동하기   ex)다음or카카오 지도 API로 문자열 받기
     * */
    const [proUpdReq, setProUpdReq] = useState({
        userAccount: '',
        address: '',
        phone: '',
        gender: '',
        nickName: '',
        birth: '',
        nation: '',
    });

    const { userAccount, address, phone, gender
        , nickName, birth, nation } = proUpdReq;


    const onChange = (event) => {
        const { value, name } = event.target;
        setProUpdReq({
            ...proUpdReq,
            [name]: value,
        });
    };

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`/user/currentUserProfile`);
            setCurUserProfile(response.data);
            /* 프로필 데이터를 가져온 후 proUpdReq 상태 업데이트 */
            setProUpdReq({
                userAccount: response.data.userAccount || '',
                address: response.data.address || '',
                phone: response.data.phone || '',
                gender: response.data.gender || '',
                nickName: response.data.nickName || '',
                birth: response.data.birth || '',
                nation: response.data.nation || '',
            });

        } catch (err) {
            console.log(err.message);
        }
    };

    const doProfileUpdate = async () => {
        chkIsEssentialValExists();

        if(isButtonDisabled){
            alert("필수정보 입력여부 확인 : 아이디 / 전화번호 / 별명")
        }else{
            try {
                await axios.put(`/user/updateUser`, proUpdReq);
                alert("회원 데이터 수정 성공 - 다시 로그인 하세요");
                await axios.get(`/auth/logout`);
                /*
                 * 로그아웃
                 * Todo : 아이디를 유지했을 경우 로그아웃 굳이 안해도 되게 하기
                 * */
                window.location.replace("/");
            } catch (err) {
                console.log(err.message);
            }
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            await getUserInfo();
            await getUserAccount();
            setIsLoading(false); // 데이터 로드 완료 후 로딩 상태 해제
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="userInfoChangeContainer">
            <br/>
            <div className="UICintroWrapper">
                <h3><b>유저 정보 수정</b></h3>
            </div>
            <br/>
            <div className="UICuserAccountRow">
                <div className="UICuserAccountInfo">
                    <h4><b>아이디</b></h4>
                </div>
                <div className="UICuserAccountBoxWrapper">
                    <input
                        className="UICuserAccountBox"
                        type="text"
                        id="userAccount"
                        name="userAccount"
                        defaultValue={curUser}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="UICphoneRow">
                <div className="UICphoneInfo">
                    <h4><b>전화번호</b></h4>
                </div>
                <div className="UICphoneBoxWrapper">
                    <input type="text" name="phone" defaultValue={curUserProfile.phone} onChange={onChange} />
                </div>
            </div>
            <div className="UICnickNameRow">
                <div className="UICnickNameInfo">
                    <h4><b>별명</b></h4>
                </div>
                <div className="UICnickNameBoxWrapper">
                    <input type="text" name="nickName" defaultValue={curUserProfile.nickName} onChange={onChange}/>
                </div>
            </div>
            <div className="UICaddressRow">
                <div className="UICaddressInfo">
                    <h4><b>주소</b></h4>
                </div>
                <div className="UICaddressBoxWrapper">
                    <input type="text" name="address" defaultValue={curUserProfile.address} onChange={onChange}/>
                </div>
            </div>
            <div className="UICgenderRow">
                <div className="UICgenderInfo">
                    <h4><b>성별</b></h4>
                </div>
                <div className="UICgenderBoxWrapper">
                    <input type="text" name="gender" defaultValue={curUserProfile.gender} onChange={onChange}/>
                </div>
            </div>
            <div className="UICbirthRow">
                <div className="UICbirthInfo">
                    <h4><b>생일</b></h4>
                </div>
                <div className="UICbirthWrapper">
                    <input type="text" name="birth" defaultValue={curUserProfile.birth} onChange={onChange}/>
                </div>
            </div>
            <div className="UICnationRow">
                <div className="UICnationInfo">
                    <h4><b>국가</b></h4>
                </div>
                <div className="UICnationBoxWrapper">
                    <input type="text" name="nation" defaultValue={curUserProfile.nation} onChange={onChange}/>
                </div>
            </div>
            <div className="UICjoinDateRow">
                <div className="UICjoinDateInfo">
                    <h4><b>가입일</b></h4>
                </div>
                <div className="UICjoinDateBoxWrapper">
                    <input type="text" value={curUserProfile.createdAt?.substring(0, 10)} readOnly={true}/>
                </div>
            </div>
            <div className="UICupdateDateRow">
                <div className="UICupdateDateInfo">
                    <h4><b>마지막 수정일</b></h4>
                </div>
                <div className="UICupdateDateBoxWrapper">
                    <input type="text" value={curUserProfile.updateDate?.substring(0, 10)} readOnly={true}/>
                </div>
            </div>
            <div className="UICchangeBtnRow">
                <Button className="UICupdateBtn" variant="secondary" onClick={doProfileUpdate}>수정하기</Button>
            </div>
        </div>
    );
}

export default UserInfoChangeForm;
