import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRef } from "react";
import ModelSelection from "./ModelSelection";
import styles from "../css/StockSearchBox.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

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
        <div className={styles.pCenter}>
            <div className={`${styles.schBx} ${styles.assignInlineBlk}`}>
                <label className={styles.textColor} htmlFor="thicker_box"><b>Ticker</b></label>
                <Form.Control id="thicker_box" ref={ticker_Ref} type="text" placeholder="Ticker" name="ticker"
                       onChange={onChange}/>
                <br/>
                <label className={styles.textColor} htmlFor="start_date_box"><b>Start</b></label>
                <Form.Control type="date" ref={start_date_Ref} id="start_date_box" name="start_date" max="2024-05-01"
                       min="2000-01-01" onChange={onChange}/>
                <br/>
                <label className={styles.textColor} htmlFor="end_date_box"><b>End</b></label>
                <Form.Control type="date" ref={end_date_Ref} id="end_date_box" name="end_date" max="2024-05-01"
                       min="2000-01-01" onChange={onChange}/>
                <br/>
                <Button variant="secondary" onClick={doSearch}>검색</Button>
            </div>
            <div className={`${styles.dfSize} ${styles.assignInlineBlk}`}>
                {loading ? (
                    <div className={styles.load}>
                        <br/>
                        <br/>
                        <br/>
                        <b className={styles.loadingText}>Search Stock datas...</b>
                    </div>
                ) : (
                    <div>
                        <div className={styles.df}>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>TimeStamp</th>
                                    {Object.entries(schRst).map(([colName, serialData]) => (
                                        <th>{colName}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {Object.keys(schRst['Open']).map(timestamp => (
                                    <tr key={timestamp}>
                                        <td>{new Date(parseInt(timestamp)).toLocaleString().substring(0, 11)}</td>
                                        <td>{schRst['Open'][timestamp]}</td>
                                        <td>{schRst['High'][timestamp]}</td>
                                        <td>{schRst['Low'][timestamp]}</td>
                                        <td>{schRst['Close'][timestamp]}</td>
                                        <td>{schRst['Adj Close'][timestamp]}</td>
                                        <td>{schRst['Volume'][timestamp]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <ModelSelection></ModelSelection>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StockSearchBox;