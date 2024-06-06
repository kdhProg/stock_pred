import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../legacy/css/StockSearchBox.module.css'
import Form from "react-bootstrap/Form";
import "../css/StockSearchBox.css"

const StockSearchBox = ()=>{

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    // const dispatch = useDispatch();

    const handleButtonClick = () => {
        // dispatch(updateSchKW(inputValue));
        navigate('/schStock/'+inputValue)
    };


    return(
        <div className="StockSchBoxContainer">
            <div className="schBoxColumn">
                <input
                    className="schBox"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="기업명 또는 Ticker"
                />
            </div>
            <div className="schInfoColumn">
                <button className="schBoxBtn" onClick={handleButtonClick}>검색</button>
            </div>
        </div>
    )
}

export default StockSearchBox;