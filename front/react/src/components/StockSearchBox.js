import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {updateSchKW} from '../redux/stringSlice';
import {useNavigate} from 'react-router-dom';
import styles from '../css/StockSearchBox.module.css'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const StockSearchBox = ()=>{

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    // const dispatch = useDispatch();

    const handleButtonClick = () => {
        // dispatch(updateSchKW(inputValue));
        navigate('/schStock/'+inputValue)
    };


    return(
        <div>
            <Row>
                <Col md={9}>
                    <Form.Control
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="기업명 또는 Ticker"
                    />
                </Col>
                <Col md={3}>
                    <button className={styles.buttonNormalDesign} onClick={handleButtonClick}>검색</button>
                </Col>
            </Row>
        </div>
    )
}

export default StockSearchBox;