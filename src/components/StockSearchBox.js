import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRef } from "react";
import ModelSelection from "./ModelSelection";

function StockSearchBox(){

    const ticker_Ref = useRef(null);
    const start_date_Ref = useRef(null);
    const end_date_Ref = useRef(null);

    const [loading, setLoading] = useState(true);

    const [schRst, setSchRst] = useState({});


    const [stockReq, setStockReq] = useState({
        ticker: '',
        start_date: '',
        end_date:'',
    });

    const { ticker, start_date, end_date } = stockReq;

    const onChange = (event) => {
        const { value, name } = event.target;
        setStockReq({
            ...stockReq,
            [name]: value,
        });
    };

    const doSearch = async () => {
        // 버튼누르기전에 변수 다시 할당  Todo 특정한 경우에 에러있는듯 나중에 ㄱ
        setStockReq({
            [ticker]: ticker_Ref.current.value,
            [start_date]: start_date_Ref.current.value,
            [end_date]: end_date_Ref.current.value,
        });

        const resp = await (await axios.post(`/showSearchResult`,stockReq)).data;

        setLoading(false);
        setSchRst(resp)

        //Todo 검색 후 재검색 시 ModelSelction도 다시 렌더링하게 만들기

    };

    return(
        <div>
            <div>
                <label htmlFor="thicker_box">주식Ticker검색</label>
                <input id="thicker_box" ref={ticker_Ref} type="text" placeholder="thicker를 입력하세요" name="ticker"
                       onChange={onChange}/>
                <br/>
                <label htmlFor="start_date_box">시작날짜</label>
                <input type="date" ref={start_date_Ref} id="start_date_box" name="start_date" max="2024-05-01"
                       min="2000-01-01" onChange={onChange}/>
                <br/>
                <label htmlFor="end_date_box">끝날짜</label>
                <input type="date" ref={end_date_Ref} id="end_date_box" name="end_date" max="2024-05-01"
                       min="2000-01-01" onChange={onChange}/>
                <br/>
                <button onClick={doSearch}>검색</button>
            </div>
            <div>
                {loading ? (
                    <h2>---loading---</h2>
                ) : (
                    <div>
                        <div>

                        </div>
                        <table>
                            <tr>
                                <th>TimeStamp</th>
                                {Object.entries(schRst).map(([colName, serialData]) => (
                                    <th>{colName}</th>
                                ))}
                            </tr>
                            {Object.keys(schRst['Open']).map(timestamp => (
                                <tr key={timestamp}>
                                    <td>{new Date(parseInt(timestamp)).toLocaleString().substring(0,11)}</td>
                                    <td>{schRst['Open'][timestamp]}</td>
                                    <td>{schRst['High'][timestamp]}</td>
                                    <td>{schRst['Low'][timestamp]}</td>
                                    <td>{schRst['Close'][timestamp]}</td>
                                    <td>{schRst['Adj Close'][timestamp]}</td>
                                    <td>{schRst['Volume'][timestamp]}</td>
                                </tr>
                            ))}
                        </table>
                        <ModelSelection></ModelSelection>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StockSearchBox;