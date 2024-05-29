import {useSelector} from "react-redux";
import ModelSelect from "../components/ModelSelect";
import {useEffect, useState} from "react";
import axios from "axios";
import SelectedDatasetPreview from "../components/SelectedDatasetPreview";


const StockPredictPage = () => {
    
    /*
    * Todo 새로고침 시 globalChoKeyword이 초기화되어버림
    * 
    * */

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
                <h2>기업정보 Preview</h2>
                <p>Ticker : {corpInfo[0]}</p>
                <p>기업명 : {corpInfo[1]}</p>
                <p>Market : {corpInfo[2]}</p>
            </div>
            <div>
                <h2>데이터 Preview</h2>
                <SelectedDatasetPreview ticker={corpInfo[0]}/>
            </div>
            <ModelSelect/>
        </div>
    )
}

export default StockPredictPage;