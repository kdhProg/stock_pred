import axios from "axios";
import "../css/SubsribePage.css"

const SubscribePage = ()=>{


    const chkUserPlan = async () => {
        await axios.put(`/payment/changeUserPlanFreeToPaid`).then(
            alert("유료계정 전환 완료")
        ).catch((err)=>{
            console.log(err)
        })
        window.location.replace("/");

    }

    return(
        <div className="subscribePageContainer">
            <div className="freePlanColumn">
                <br/>
                <div className="subsPlanIntroRow">
                    <h3><b>일반 계정</b></h3>
                </div>
                <br/>
                <div className="subsPlanButtonRow">
                    <button className="subsPagenormalBtn">
                        <p>일반계정 전환</p>
                    </button>
                </div>
                <br/><br/>
                <hr/>
                <div className="subsPlanFeatureListRow">
                    <br/>
                    <p>&nbsp;&raquo; 사용자 지정 시작일, 마지막일</p>
                    <br/>
                    <p>&nbsp;&raquo; 다수의 예측 컬럼 지정 가능</p>
                    <br/>
                    <p>&nbsp;&raquo; OHCLV 중 1개의 예측 목표 컬럼</p>
                    <br/>
                    <p>&nbsp;&raquo; 모델 Epoch 설정 가능</p>
                </div>
            </div>
            <div className="paidPlanColumn">
                <br/>
                <div className="subsPlanIntroRow">
                    <h3><b className="subsPlanPaidPlanIntro">유료 계정</b></h3>
                </div>
                <br/>
                <div className="subsPlanButtonRow">
                    <button className="subsPagePaidBtn" onClick={chkUserPlan}>
                        <p>월 $9.99</p>
                    </button>
                </div>
                <br/><br/>
                <hr/>
                <div className="subsPlanFeatureListRow">
                    <br/>
                    <p>&nbsp;&raquo; 과거 N일 학습 데이터 범위 지정 가능</p>
                    <br/>
                    <p>&nbsp;&raquo; Train / Test 분할 비율</p>
                    <br/>
                    <p>&nbsp;&raquo; Validation 데이터 분할 비율</p>
                    <br/>
                    <p>&nbsp;&raquo; Batch size 지정 가능</p>
                </div>
            </div>
        </div>
    )
}

export default SubscribePage;