import {useEffect, useState} from "react";
import axios from "axios";
import { Chart } from 'react-google-charts';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import styles from "../legacy/css/SelectedDatasetPreview.module.css"
import {Spinner} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../css/SelectedDataserPreview.css"

const SelectedDatasetPreview = (props) => {

    /* props */
    const ticker = props.ticker;

    /* 데이터 로드 여부 */
    const [isLoading, setIsLoading] = useState(true);

    /* 데이터 로드 버튼 활성화 여부 */
    const [isDisabled, setIsDisabled] = useState(false);

    /* get: showSelectedEntireData 전송용 */
    const [dataReq, setDataReq] = useState({
        startDate:'',
        endDate:'',
        ticker:'',
        colName:''
    });

    /* 날짜 박스 핸들러 */
    const onChangeDate = (e)=>{
        const { value, name } = e.target;
        setDataReq({
            ...dataReq,
            [name]: value,
        });
    }


    /* radio 선택시 dataReq값 갱신 */
    const handleRadioChange = (event) => {
        const { value } = event.target;
        setDataReq((prevParams) => ({
            ...prevParams,
            colName: value
        }));
    };

    /*
    * get: showSelectedEntireData 응답값
    * 형태 : {"index" : { , , , , , }, "val" : { , , , , }}
    * index : X값(날짜)    val : Y값(종가)
    *
    *  */
    const showSelectedEntireData = async () => {
        setIsDisabled(true);
        await axios.get(`/pred/showSelectedEntireData?&ticker=${dataReq.ticker}&colName=${dataReq.colName}&startDate=${dataReq.startDate}&endDate=${dataReq.endDate}`)
            .then((res) => {
            setIsLoading(false);
            setChartData(makeProperDataForm(res.data));
            setIsDisabled(false);
        })
        .catch((err) => {
            alert("날짜 또는 컬럼을 확인하세요.")
            setIsDisabled(false);
            console.log(err.message);
        });
    }

    /* google차트에 맞는 형태의 데이터로 변환 */
    const makeProperDataForm = (input)=>{
        const rst = [];
        const index = ['Date','data'];
        rst.push(index);

        for(let i = 0; i<(input.val).length; i++){
            const row = [];
            row.push((input.index)[i]);
            row.push((input.val)[i]);
            rst.push(row);
        }
        return rst;
    }


    /* Google Chart 옵션 */
    const chartOptions = {
        title: 'Dataset Preview',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    /* Google Chart data */
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (ticker) {
            setDataReq(prev => ({
                ...prev,
                ticker: ticker
            }));
        }
    }, [ticker]);


    return(
        <div className="selectedDataserPreviewContainer">
            <div className="datasetParamColumn">
                {/*<div className="datasetPreviewInfo">*/}
                {/*    <h3><b>데이터셋 프리뷰</b></h3>*/}
                {/*</div>*/}
                {/*<br/><br/><br/><br/>*/}
                <div className="startDateRow">
                    <div className="startDateInfo">
                        <b>시작일</b>
                    </div>
                    <div className="startDateBox">
                        <input className="prevDateBtn" id="startDate" type="date" name="startDate"
                               onChange={onChangeDate}/>
                    </div>
                </div>
                <br/>
                <div className="endDateRow">
                    <div className="endDateInfo">
                        <b>마지막일</b>
                    </div>
                    <div className="endDateBox">
                        <input className="prevDateBtn" id="endDate" type="date" name="endDate"
                               onChange={onChangeDate}/>
                    </div>
                </div>
                <br/><br/>
                <div className="selectColumnRadioBoxRow">
                    <div className="selectColumnRadioInfo">
                        <b>조회할 컬럼</b>
                    </div>
                    <div className="selectColumnRadioBoxes">
                        <label htmlFor="">시가</label>
                        <Form.Check className="prevColRadio" type="radio" name="colName" value="Open" onChange={handleRadioChange}/>&nbsp;&nbsp;
                        <label htmlFor="">고가</label>
                        <Form.Check className="prevColRadio" type="radio" name="colName" value="High" onChange={handleRadioChange}/>&nbsp;&nbsp;
                        <label htmlFor="">저가</label>
                        <Form.Check className="prevColRadio" type="radio" name="colName" value="Low" onChange={handleRadioChange}/>&nbsp;&nbsp;
                        <label htmlFor="">종가</label>
                        <Form.Check className="prevColRadio" type="radio" name="colName" value="Close" onChange={handleRadioChange}/>&nbsp;&nbsp;
                        <label htmlFor="">거래량</label>
                        <Form.Check className="prevColRadio" type="radio" name="colName" value="Volumne" onChange={handleRadioChange}/>
                    </div>
                </div>
                <br/><br/>
                <div className="prevBtnRow">
                    {isDisabled?(
                        <Button className="prevBtn" variant="secondary" onClick={showSelectedEntireData} disabled={isDisabled}>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        </Button>
                    ):(
                        <Button className="prevBtn" variant="secondary" onClick={showSelectedEntireData} disabled={isDisabled}>데이터검색</Button>
                    )
                    }
                </div>
            </div>
            <div className="datasetChartColumn">
                {isLoading ? (
                    <div>
                        <br/><br/><br/>
                        <b>지정한 데이터셋의 프리뷰를 그래프로 확인하세요.</b>
                    </div>
                ) : (
                    <Chart
                        chartType="LineChart"
                        width="700px"
                        height="400px"
                        data={chartData}
                        options={chartOptions}
                    />
                )}
            </div>
        </div>
    )
}

export default SelectedDatasetPreview;