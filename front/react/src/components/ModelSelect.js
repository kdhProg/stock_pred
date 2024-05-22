import axios from "axios";
import React, {useEffect, useState} from "react";


const ModelSelect = () => {

    const [freeModels, setFreeModels] = useState([]);
    const [paidModels, setPaidModels] = useState([]);

    const [isPaidPlan, setIsPaidPlan] = useState(false);

    /* 무료 모델 */
    const getFreeModels = async () => {
        await axios.get(`/pred/showFreeModelList`)
            .then((resp) => {
                setFreeModels(resp.data)
                }
            )
            .catch((err) => {
                console.log(err)
            })
    }

    /* 유료 모델 */
    const getPaidModels = async () => {
        await axios.get(`/pred/showPaidModelList`)
            .then((resp) => {
                setPaidModels(resp.data)
                }
            )
            .catch((err) => {
                console.log(err)
            })
    }




    useEffect(() => {
        getFreeModels();
        getPaidModels();

        /* 현재 사용자 구독여부 체크  무료:0  유료:1 */
        /* Todo 구독여부 체크 메서드 분리하기 */
        axios.get(`/user/currentUserPlan`)
            .then((resp) => {
                    if(resp.data === 1){
                        setIsPaidPlan(true)
                    }
                }
            )
            .catch((err) => {
                console.log(err)
            })
    }, []);

    return(
        <div>
            <div>
                <h2>무료 모델</h2>
                <ul>
                    {freeModels.map((modelName) => (
                        <li key={modelName}>
                            <input type="radio" name="predModel" value={modelName}/>
                            <label htmlFor={modelName}>{modelName}</label>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>유료 모델</h2>

                {isPaidPlan ? (
                    <ul>
                        {paidModels.map((modelName) => (
                            <li key={modelName}>
                                <input type="radio" name="predModel" value={modelName}/>
                                <label htmlFor={modelName}>{modelName}</label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <p>유료회원 전용입니다.</p>
                    </div>

                )}
            </div>
        </div>
    )
}

export default ModelSelect;