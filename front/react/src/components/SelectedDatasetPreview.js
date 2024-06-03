import {useEffect, useState} from "react";
import axios from "axios";
import { Chart } from 'react-google-charts';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import styles from "../css/SelectedDatasetPreview.module.css"

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
        });
    }

    /* google차트에 맞는 형태의 데이터로 변환 */
    const makeProperDataForm = (input)=>{
        const rst = [];
        const index = ['Date','Column'];
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
        <div>
            <Row className={styles.previewRowHeightFix}>
                <Col md={4}>
                    <Row>
                        <Col>
                            <label htmlFor="startDate">start date</label>
                            <input id="startDate" type="date" name="startDate" onChange={onChangeDate}/>

                            <label htmlFor="endDate">end date</label>
                            <input id="endDate" type="date" name="endDate" onChange={onChangeDate}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h4>조회할 컬럼</h4>
                            <label htmlFor="">시가</label>
                            <input type="radio" name="colName" value="Open" onChange={handleRadioChange}/>&nbsp;&nbsp;
                            <label htmlFor="">고가</label>
                            <input type="radio" name="colName" value="High" onChange={handleRadioChange}/>&nbsp;&nbsp;
                            <label htmlFor="">저가</label>
                            <input type="radio" name="colName" value="Low" onChange={handleRadioChange}/>&nbsp;&nbsp;
                            <label htmlFor="">종가</label>
                            <input type="radio" name="colName" value="Close" onChange={handleRadioChange}/>&nbsp;&nbsp;
                            <label htmlFor="">거래량</label>
                            <input type="radio" name="colName" value="Volumne" onChange={handleRadioChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="secondary" onClick={showSelectedEntireData} disabled={isDisabled}>데이터 로드하기</Button>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    {isLoading ? (
                        <div>
                            ........loading.....
                        </div>
                    ) : (
                        <div>
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="300px"
                                data={chartData}
                                options={chartOptions}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default SelectedDatasetPreview;