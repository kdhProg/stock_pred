import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { updateString } from '../redux/stringSlice';
import { useNavigate } from 'react-router-dom';

const StockSearchBox = ()=>{

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        dispatch(updateString(inputValue));
        navigate("/schStock")
    };


    return(
        <span>
          <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleButtonClick}>Update String</button>
        </span>
    )
}

export default StockSearchBox;