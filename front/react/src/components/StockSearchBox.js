import React, {useState} from 'react';

const StockSearchBox = ()=>{

    const [schReq, setSchReq] = useState({
        keyword: ''
    });

    const { keyword } = schReq;

    const onChange = (event) => {
        const { value, name } = event.target;
        setSchReq({
            ...schReq,
            [name]: value,
        });
    };

    const doSearch = () => {
        /* 특정 페이지로 이동해서 + 키워드 넘겨주기 */
        window.location.replace("/schStock");
    };

    return(
        <span>
            <input type="text" name="keyword" value={keyword} onChange={onChange} placeholder="주식명 검색"/>
            <button onClick={doSearch}>검색</button>
        </span>
    )
}

export default StockSearchBox;