import axios from "axios";

const Logout = () => {

    const doLogout = async () => {
        const resp = await axios.get(`/auth/logout`)
    };

    return (
        <div>
            <button onClick={doLogout}>로그아웃</button>
        </div>
)
}

export default Logout;