
import axios from "axios";

const CHK_URL = `/user/currentUserPlan`;

export const chkPaidUser = async () => {
    await axios.get(CHK_URL)
        .then((resp) => {
                if(resp.data === '1'){
                    return true;
                }
                return false;
            }
        )
        .catch((err) => {
            console.log(err)
        })
};