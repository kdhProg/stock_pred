import axios from "axios";

const Logout = () => {

    const doLogout = async () => {
        await axios.get(`/auth/logout`)
        alert("로그아웃 성공")
        window.location.replace("/");
    };

    return (
        <div>
            <button onClick={doLogout}>로그아웃</button>
        </div>
)
}

export default Logout;