import React, { useEffect, useState } from 'react';
import axios from 'axios';


function ShowCsvInfo() {

    const [csvInfo, setCsvInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const getCsvInfo = async () => {
        const resp = await (await axios.get(`/showCsvInfo`)).data;
        setCsvInfo(resp);
        setLoading(false);
    };

    useEffect(() => {
        getCsvInfo();
    }, []);

    // console.log(csvInfo.columns)
    return(
        <div>
            {loading ? (
                <h2>loading...</h2>
            ) : (
                <div>
                    <b>업로드된 CSV파일명</b>
                    <p>{csvInfo.name}</p>
                    <p>---------</p>
                    <b>컬럼들</b>
                    <ul>
                        {csvInfo.columns.map((col) => (
                            <li>
                                <p>{col}</p>
                            </li>
                        ))}
                    </ul>
                    <p>---------</p>
                    <b>행 개수</b>
                    <p>{csvInfo.rows}</p>
                </div>
            )}
        </div>
    )
}

export default ShowCsvInfo;