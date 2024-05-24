import axios from "axios";

export const chkIsAuthenticated = async () => {
    try {
        const resp = await axios.get(`/auth/status`);
        return response.data.authenticated;
    } catch (err) {
        console.log(err);
        return false;
    }
};













