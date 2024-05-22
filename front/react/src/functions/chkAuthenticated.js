
import axios from "axios";

const CHK_URL = `/auth/status`;

export const chkAuthenticated = async () => {
    await axios.get(CHK_URL)
        .then((response) =>{
                if(response.data.authenticated){
                    return true;
                }
            return false;
            }
        )
        .catch((err) => {
            console.log(err.message);
            return false;
        })
};