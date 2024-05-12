import React, { useEffect, useState } from 'react';
import axios from 'axios';


function ModelSelection(){

    const [csvList, setCsvList] = useState([]);

    const getCsvList = async () => {
        const resp = (await axios.get(`/showCsvList`)).data;
        setCsvList(resp)

    };

    useEffect(() => {
        getCsvList();
    }, []);


    return(
        <div>
            <h1>Csv In Server</h1>
            <ul>
                {csvList.map((csvName) => (
                    <li key={csvName}><button>{csvName}</button></li>
                ))}
            </ul>
        </div>
    )
}

export default ModelSelection;