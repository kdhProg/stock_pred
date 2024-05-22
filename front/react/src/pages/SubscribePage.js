import axios from "axios";
import {useEffect} from "react";

const SubscribePage = ()=>{


    const chkUserPlan = async () => {
        await axios.put(`/payment/changeUserPlanFreeToPaid`).then(
            alert("당신은 돈을 바쳤습니다!!!!!")
        ).catch((err)=>{
            console.log(err)
        })
        window.location.replace("/");

    }

    return(
        <div>
            <h1>아래 버튼을 누르면 유료계정으로 전환됩니다ㄷㄷ</h1>
            <button onClick={chkUserPlan}>개발자에게 돈 바치기</button>
        </div>
    )
}

export default SubscribePage;