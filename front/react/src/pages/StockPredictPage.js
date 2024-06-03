import React, {useEffect, useState} from "react";
import axios from "axios";
import SelectedDatasetPreview from "../components/SelectedDatasetPreview";
import {Chart} from "react-google-charts";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useParams} from "react-router-dom";


const StockPredictPage = () => {
    
    /*
    * 20240531 - ModelSelect.js의 코드 이곳으로 옮김 -> Todo refactoring 필요(변수값 넘기기)
    * Todo 기능별 컴포넌트 분리하기
    * Todo 예측기준컬럼/타겟 컬럼 선정시 -> 타겟 컬럼은 반드시 예측기준컬럼중 하나여야 함 --> open/close 가지고 volumne을 예측할순없으므로
    * */

    /* 검색어 */
    // const globalChoKeyword = useSelector(state => state.string.choStockKeyword);
    // 20240603  전역 redux방식에서 useParams방식으로 변경

    /* 요청용 필드 */
    const ticker = useParams().ticker;


    /* 기업정보 - ticker / 기업명 / market */
    const [corpInfo, setCorpInfo] = useState([]);


    /* 무료모델 */
    const [freeModels, setFreeModels] = useState([]);

    /* 유료모델 */
    const [paidModels, setPaidModels] = useState([]);

    /* 유료계정 여부 */
    const [isPaidPlan, setIsPaidPlan] = useState(false);

    /* 최종 모델 전송용 필드 */
    const [predModelReq, setPredModelReq] = useState({
        isFreeModel:true,
        modelFileName:'',
        ticker:'',
        startDate:'',
        endDate:'',
        epoch:100,
        predColumns:[],
        targetColumn:'Open',
        pastPredDays:30,
        trainTestSplit:30,
        validPercentage:10,
        batchSize:30
    });


    /* 최종 예측 response 여부 */
    const [isRstLoaded, setIsRstLoaded] = useState(false);


    /* 최종 예측 tomorrow 값 */
    const [tomorrowValue, setTomorrowValue] = useState(null);

    /* 예측 버튼 활성화 여부 */
    const [isDisabled, setIsDisabled] = useState(false);

    /* ticker에 해당하는 기업 정보 가져오기 */
    const getCorpInfo = async (val) => {
        await axios.get(`/pred/getTickerCorpInfo?ticker=${val}`)
            .then((response) => {
                    setCorpInfo(response.data)
                setPredModelReq({
                    ...predModelReq,
                    ticker: (response.data)[0],
                });
                }
            )
            .catch((err) => {
                console.log(err.message);
            })
    }

    /* 무료 모델 */
    const getFreeModels = async () => {
        await axios.get(`/pred/showFreeModelList`)
            .then((resp) => {
                    setFreeModels(resp.data)
                }
            )
            .catch((err) => {
                console.log(err)
            })
    }

    /* 유료 모델 */
    const getPaidModels = async () => {
        await axios.get(`/pred/showPaidModelList`)
            .then((resp) => {
                    setPaidModels(resp.data)
                }
            )
            .catch((err) => {
                console.log(err)
            })
    }

    /* predModelReq 값 change */
    const onChange = (event) => {
        const { value, name } = event.target;
        setPredModelReq({
            ...predModelReq,
            [name]: value,
        });
    };


    /* 예측기준 컬럼 체크박스 */
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setPredModelReq((prevState) => {
            const predColumns = checked
                ? [...prevState.predColumns, value]
                : prevState.predColumns.filter((column) => column !== value);
            return {
                ...prevState,
                predColumns,
            };
        });
    };

    /* 예측 컬럼 target  */
    const onChangeTarget = (e)=>{
        const { value, name } = e.target;
        setPredModelReq({
            ...predModelReq,
            [name]: value,
        });
    }

    /* freeModel change */
    const freeModelChange = (event) => {
        const { value } = event.target;
        setPredModelReq((prevParams) => ({
            ...prevParams,
            isFreeModel: true,
            modelFileName : value
        }));
    };

    /* paidModel change*/
    const paidModelChange = (event) => {
        const { value } = event.target;
        setPredModelReq((prevParams) => ({
            ...prevParams,
            isFreeModel: false,
            modelFileName : value
        }));
    };


    /* 서버로 예측 요청 전송 */
    const doPredict = async () => {
        setIsDisabled(true);
        await axios.post(`/pred/doPredict`,predModelReq)
            .then((resp) => {
                    alert("예측 완료")
                setIsDisabled(false);
                setIsRstLoaded(true)
                let data = resp.data
                setChartData(makeProperDataForm(data));
                setTomorrowValue(data.tomorrow_value);
                }
            )
            .catch((err) => {
                setIsDisabled(false);
                alert("모델 에러 -> 값을 바꿔 재시도")
                console.log(err)
            })

    }


    /* goolge chart */
    /* google차트에 맞는 형태의 데이터로 변환 */
    const makeProperDataForm = (input)=>{
        const rst = [];
        const index = ['Date','prediction','real'];
        rst.push(index);

        for(let i = 0; i<(input.x_index).length; i++){
            const row = [];
            row.push((input.x_index)[i]);
            row.push((input.pred)[i]);
            row.push((input.real)[i]);
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
    /* 최종 예측 response - JSON */
    const [chartData, setChartData] = useState({
        x_index: [],
        pred: [],
        real: [],
        tomorrow_value: 0
    });


    useEffect(() => {
        getCorpInfo(ticker)

        getFreeModels();
        getPaidModels();

        /* 현재 사용자 구독여부 체크  무료:0  유료:1 */
        /* Todo 구독여부 체크 메서드 분리하기 */
        axios.get(`/user/currentUserPlan`)
            .then((resp) => {
                    if(resp.data === 1){
                        setIsPaidPlan(true)
                    }
                }
            )
            .catch((err) => {
                console.log(err)
            })

    }, [ticker]);

    return(
        <div>
            <Container>
                <Row>
                    <Col>
                        <div>
                            <h2>기업정보 Preview</h2>
                            <p>Ticker : {corpInfo[0]}</p>
                            <p>기업명 : {corpInfo[1]}</p>
                            <p>Market : {corpInfo[2]}</p>
                        </div>
                    </Col>
                </Row>
                <SelectedDatasetPreview ticker={corpInfo[0]}/>
                <Row>
                    <Col>
                        무료 파라미터
                    </Col>
                    <Col>
                        유료 파라미터
                    </Col>
                </Row>
                <Row>
                    <Col>
                        테스트셋 그래프
                    </Col>
                    <Col>
                        등락률 그래프
                    </Col>
                </Row>
            </Container>
            <hr/>
            <div>
                <h2>무료 모델</h2>
                <ul>
                    {freeModels.map((modelName) => (
                        <li key={modelName}>
                            <input type="radio" name="predModel" value={modelName} onChange={freeModelChange}/>
                            <label htmlFor={modelName}>{modelName.slice(0, -3)}</label>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>유료 모델</h2>

                {isPaidPlan ? (
                    <ul>
                        {paidModels.map((modelName) => (
                            <li key={modelName}>
                                <input type="radio" name="predModel" value={modelName} onChange={paidModelChange}/>
                                <label htmlFor={modelName}>{modelName.slice(0, -3)}</label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <p>유료회원 전용입니다.</p>
                    </div>

                )}
            </div>
            <hr/>
            {/* 파라미터 선택*/}
            <div>
                <label htmlFor="">startDate</label>
                <input name="startDate" type="date" onChange={onChange}/>
                <br/>
                <label htmlFor="">endDate</label>
                <input name="endDate" type="date" onChange={onChange}/>
                <br/>
                <label htmlFor="">epoch</label>
                <input name="epoch" type="number" onChange={onChange}/>
                <br/>
                <p>예측 기준 컬럼 - OHLCV</p>
                <label htmlFor="">시가 Open</label>
                <input name="predColumns" value="Open" type="checkbox" onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                <label htmlFor="">고가 High</label>
                <input name="predColumns" value="High" type="checkbox" onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                <label htmlFor="">저가 Low</label>
                <input name="predColumns" value="Low" type="checkbox" onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                <label htmlFor="">종가 Close</label>
                <input name="predColumns" value="Close" type="checkbox" onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                <label htmlFor="">거래량 Volumne</label>
                <input name="predColumns" value="Volumne" type="checkbox" onChange={handleCheckboxChange}/>
                <br/>
                <select name="targetColumn" onChange={onChangeTarget}>
                    <option value="Open">시가</option>
                    <option value="High">고가</option>
                    <option value="Low">저가</option>
                    <option value="Close">종가</option>
                    <option value="Volumne">거래량</option>
                </select>
            </div>
            <div>
                {isPaidPlan ? (
                    <div>
                        <label htmlFor="">과거N일로 예측?</label>
                        <input name="pastPredDays" type="number" onChange={onChange}/>
                        <br/>
                        <label htmlFor="">Train/Test 비율</label>
                        <input name="trainTestSplit" type="number" onChange={onChange}/>
                        <br/>
                        <label htmlFor="">Validation Data 비율</label>
                        <input name="validPercentage" type="number" onChange={onChange}/>
                        <br/>
                        <label htmlFor="">batchSize</label>
                        <input name="batchSize" type="number" onChange={onChange}/>
                    </div>
                ) : (
                    <div>
                        <p>유료회원만 선택 가능 필드입니다.</p>
                        [기본값]
                        pastPredDays:30,
                        trainTestSplit:30,
                        validPercentage:10,
                        batchSize:30
                    </div>
                )}
            </div>
            <hr/>
            <button onClick={()=>{console.log("predModelReq:  "+JSON.stringify(predModelReq))}}>콘솔에 전송객체 값 찍어보기</button>
            <br/>
            <button onClick={doPredict} disabled={isDisabled}>예측하기!!!!!!!!!!</button>
            <div>
                <h2>예측결과 TEST 데이터</h2>
                {isRstLoaded?(
                    <div>
                        <Chart
                            chartType="LineChart"
                            width="100%"
                            height="700px"
                            data={chartData}
                            options={chartOptions}
                        />
                        <div>
                            <h3>내일 예측값:</h3>
                            <p>Prediction : {chartData.tomorrow_value}</p>
                            <p>{tomorrowValue}</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        ....loading
                    </div>
                )}
            </div>
        </div>
    )
}

export default StockPredictPage;