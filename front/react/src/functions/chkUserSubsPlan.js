import axios from "axios";

export const chkUserSubsPlan = async () => {
    try {
        const resp = await axios.get(`/user/currentUserPlan`);
        return resp.data === 1;
    } catch (err) {
        console.log(err);
        return false;
    }
}