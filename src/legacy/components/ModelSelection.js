import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../css/ModelSelection.module.css'
import Button from "react-bootstrap/Button";


function ModelSelection(){

    const [csvList, setCsvList] = useState([]);
    const [modelList, setModelList] = useState([]);

    const [predRequest, setPredRequest] = useState({
        csvName: '',
        modelName: '',
    });

    const [predRst, setPredRst] = useState(0);

    const getCsvList = async () => {
        const resp = (await axios.get(`/showCsvList`)).data;
        setCsvList(resp)

    };

    const getModelList = async () => {
        const resp = (await axios.get(`/showModelList`)).data;
        setModelList(resp)
    };

    const radioBtnCsv = (e)=>{
        const { value, name } = e.target;
        setPredRequest({
            ...predRequest,
            ["csvName"]: e.target.value,
        });
    }

    const radioBtnModel = (e)=>{
        const { value, name } = e.target;
        setPredRequest({
            ...predRequest,
            ["modelName"]: e.target.value,
        });
    }


    const doPrediction = async () => {
        const resp = await (await axios.post(`/showPredResult`,predRequest)).data;
        setPredRst(resp)
    };


    useEffect(() => {
        getCsvList();
        getModelList();
    }, []);


    return(
        <div>
            <div className={styles.csvList}>
                <h1>Csv In Server</h1>
                <ul>
                    {csvList.map((csvName) => (
                        <li key={csvName}>
                            <input type="radio" id={csvName} name="csvName" value={csvName} onChange={radioBtnCsv}/>
                            <label htmlFor={csvName}>{csvName}</label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.modelList}>
                <h1>Prediction Models In Server</h1>
                <ul>
                    {modelList.map((modelName) => (
                        <li key={modelName}>
                            <input type="radio" id={modelName} name="modelName" value={modelName}
                                   onChange={radioBtnModel}/>
                            <label htmlFor={modelName}>{modelName}</label>
                        </li>
                    ))}
                </ul>
            </div>
            <Button variant="danger" class="btn-primary" onClick={doPrediction}>예측하기</Button>
            <div className={styles.predRst}>
                <h1>Result</h1>
                <p className={styles.predRstFont}>{predRst}</p>
            </div>
        </div>
    )
}

export default ModelSelection;