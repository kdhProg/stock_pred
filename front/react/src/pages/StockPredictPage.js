import {useSelector} from "react-redux";
import ModelSelect from "../components/ModelSelect";
import {useEffect, useState} from "react";
import axios from "axios";


const StockPredictPage = () => {

    const globalChoKeyword = useSelector(state => state.string.choStockKeyword);

    const [corpInfo, setCorpInfo] = useState([]);

    const getCorpInfo = async (val) => {
        await axios.get(`/pred/getTickerCorpInfo?ticker=${val}`)
            .then((response) => {
                    setCorpInfo(response.data)
                }
            )
            .catch((err) => {
                console.log(err.message);
            })
    }

    useEffect(() => {
        getCorpInfo(globalChoKeyword)
    }, [globalChoKeyword]);

    return(
        <div>
            <h1>예측 페이지</h1>
            <div>
                <p>Ticker : {corpInfo[0]}</p>
                <p>기업명 : {corpInfo[1]}</p>
                <p>Market : {corpInfo[2]}</p>
            </div>
            <ModelSelect/>
        </div>
    )
}

export default StockPredictPage;