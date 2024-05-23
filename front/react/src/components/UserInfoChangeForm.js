import axios from "axios";
import { useEffect, useState } from "react";

const UserInfoChangeForm = () => {
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
        try {
            await axios.put(`/user/updateUser`, proUpdReq);
            alert("회원 데이터 수정 성공 - 다시 로그인 ㄱ");
            await axios.get(`/auth/logout`);
            /*
             * 로그아웃
             * Todo : 아이디를 유지했을 경우 로그아웃 굳이 안해도 되게 하기
             * */
            window.location.replace("/");
        } catch (err) {
            console.log(err.message);
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
        <div>
            <h3>유저 정보 수정</h3>
            <div>
                <label htmlFor="userAccount">아이디</label>
                <input
                    type="text"
                    id="userAccount"
                    name="userAccount"
                    defaultValue={curUser}
                    onChange={onChange}
                />
            </div>
            {Object.entries(curUserProfile).slice(0, -2).map(([key, value]) => (
                <div key={key}>
                    <label htmlFor={key}>{key}</label>
                    <input
                        type="text"
                        id={key}
                        name={key}
                        defaultValue={value}
                        onChange={onChange}
                    />
                </div>
            ))}
            <div>
                <p>가입일 : {curUserProfile.createdAt?.substring(0, 10)}</p>
            </div>
            <div>
                <p>마지막 수정일 : {curUserProfile.updateDate?.substring(0, 10)}</p>
            </div>
            <button onClick={doProfileUpdate}>수정하기</button>
        </div>
    );
}

export default UserInfoChangeForm;
