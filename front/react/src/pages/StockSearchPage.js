import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {updateChoKW} from "../redux/stringSlice";
import {useNavigate} from "react-router-dom";


const StockSearchPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* 전역 검색값(문자열 받아오기) */
    const globalKeywordStore = useSelector(state => state.string.schStockKeyword);

    /* 서버로부터 요청 결과 받기*/
    const [schList, setSchList] = useState({});

    const doSearch = async (keyword) => {
        await axios.get(`/pred/stockNameSearch?keyword=${keyword}`)
            .then((response) => {
                    setSchList(response.data)
                }
            )
            .catch((err) => {
                console.log(err.message);
            })
    }


    const choButtonClick = (ticker) => {
        dispatch(updateChoKW(ticker));
        navigate("/predStock")
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                await doSearch(globalKeywordStore);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        return () => {
            // cleanup 작업 수행
        };
    }, [globalKeywordStore]);


    return (
        <div>
            <p>검색어 : {globalKeywordStore}</p>
            <ul>
                {Object.entries(schList).map(([corpName, ticker]) => (
                    <li key={ticker}>
                        <span>{corpName}</span>
                        &nbsp;&nbsp;
                        <span>{ticker}</span>
                        <button onClick={() => choButtonClick(ticker)}>choose</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default StockSearchPage;