import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {updateSchKW} from '../redux/stringSlice';
import {useNavigate} from 'react-router-dom';

const StockSearchBox = ()=>{

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        dispatch(updateSchKW(inputValue));
        navigate("/schStock")
    };


    return(
        <span>
          <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleButtonClick}>검색하기</button>
        </span>
    )
}

export default StockSearchBox;