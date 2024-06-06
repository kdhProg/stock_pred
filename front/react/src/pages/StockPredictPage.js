import React, {useEffect, useState} from "react";
import axios from "axios";
import SelectedDatasetPreview from "../components/SelectedDatasetPreview";
import {Chart} from "react-google-charts";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useParams} from "react-router-dom";
import styles from "../legacy/css/StockPredictPage.module.css"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Accordion, Spinner} from "react-bootstrap";
import "../css/StockPredictPage.css"

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
                setTodayValue(data.today_value)

                setMarcapValue(marcapDonutmakeProperDataForm(data))
                }
            )
            .catch((err) => {
                setIsDisabled(false);
                alert("모델 에러 -> 값을 바꿔 재시도")
                console.log(err)
            })

    }


    /* goolge chart Test결과*/
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


    /* Google Chart Test결과 옵션 */
    const chartOptions = {
        title: '',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    /* Google Chart data */
    /* 최종 예측 Test결과 response - JSON */
    const [chartData, setChartData] = useState({
        x_index: [],
        pred: [],
        real: []
    });



    /* goolge chart 등락(도넛그래프)*/
    const marcapDonutmakeProperDataForm = (input)=>{
        const rst = [];
        const index = ['marcap','percentage'];
        rst.push(index);

        const todayValue = input.today_value
        const tomorrowValue = input.tomorrow_value;

        /* 등락률 - 기준일 : 오늘(todayValue)   공식 : 예상일(내일) - 오늘 / 오늘 * 100 */
        const marcapVal = (tomorrowValue-todayValue)/todayValue

        if(marcapVal >= 0){
            setMarcapDonutChartOptions(prevOptions => ({
                ...prevOptions,
                slices: {
                    ...prevOptions.slices,
                    0: { color: 'blue' }
                }
            }));
        }

        /* 적절하지 않은 예상값 : 100%이상 증감 --> 이 나와도 그래프는 일단 100으로 표시
        *  20240606 -> 적절히 예측한 경우는 거의 10% 내외의 증감률을 보임 -> 도넛그래프가 "밋밋"해보임
        * --> ex) 8% 증가 --> 그래프 자체는 80%로 뻥튀기해서 보여주기 -> 추가로 *10
        * */
        const marpcapPercentage = Math.min(Math.abs(marcapVal) * 100 * 10,100);
        console.error("적절하지 않은 예상값 감지 -> 검증 필요 ")

        const data = ['marcap',marpcapPercentage]
        rst.push(data);

        const offset = ['offset',100-marpcapPercentage]
        rst.push(offset);

        return rst
    }
    
    /* googleChart 등락 관련 state */
    const [marcapValue, setMarcapValue] = useState({
        marcap:[],
        percentage:[]
    })

    /* Google Chart 등락(도넛그래프) 옵션 */
    const [marcapDonutChartOptions,setMarcapDonutChartOptions] = useState({
        title: "",
        legend:'none',
        is3D: true,
        tooltip: { trigger: 'none' },
        slices: {
            0: { color: 'red' },
            1: { color: 'transparent' }
        }

    });


    /* 오늘, 내일 예측값 */
    const [todayValue,setTodayValue] = useState(0);
    const [tomorrowValue,setTomorrowValue] = useState(0);


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
        <div className="stockPredictEntireContainer">
            <br/><br/>
            <div className="corpInfoRow">
                <div className="corpInfoColumn">
                    <br/>
                    <h4><b>Ticker</b></h4>
                    <p className="corpInfoDataPtag">{corpInfo[0]}</p>
                </div>
                <div className="corpInfoColumn">
                    <br/>
                    <h4><b>기업명</b></h4>
                    <p className="corpInfoDataPtag">{corpInfo[1]}</p>
                </div>
                <div className="corpInfoColumn">
                    <br/>
                    <h4><b>주식시장</b></h4>
                    <p className="corpInfoDataPtag">{corpInfo[2]}</p>
                </div>
            </div>
            <br/>
            <div className="datasetPreviewRow">
                <Accordion>
                    <Accordion.Item  eventKey="0">
                        <Accordion.Header>
                            <div className="datasetPreviewAccordionHeader">
                                <h4><b>데이터셋 프리뷰</b></h4>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <SelectedDatasetPreview ticker={corpInfo[0]}/>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            <br/>
            <div className="modelSelectRow">
                <div className="freeModelColumn">
                    <br/>
                    <div className="freeModelInfo">
                        <h2><b>기본 모델</b></h2>
                    </div>
                    <br/>
                    <div className="freeModelLists">
                        {freeModels.map((modelName) => (
                            <div key={modelName}>
                                <div className="freeModelEach">
                                    <label htmlFor={modelName}>{modelName.slice(0, -3)}</label>
                                    <Form.Check id={modelName} type="radio" name="predModel" value={modelName}
                                                onChange={freeModelChange}/>
                                </div>
                                <br/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="paidModelColumn">
                    <br/>
                    <div className="paidModelInfo">
                        <h2><b>유료 모델</b></h2>
                    </div>
                    <br/>
                    <div className="paidModelLists">
                        {isPaidPlan ? (
                            <span>
                            {paidModels.map((modelName) => (
                                <div key={modelName}>
                                    <div className="paidModelEach">
                                        <label htmlFor={modelName}>{modelName.slice(0, -3)}</label>
                                        <Form.Check id={modelName} type="radio" name="predModel" value={modelName}
                                                    onChange={paidModelChange}/>
                                    </div>
                                    <br/>
                                </div>
                            ))}
                            </span>
                        ) : (
                            <div>
                                <br/>
                                <p>유료회원 전용입니다.</p>
                            </div>

                        )}
                    </div>
                </div>
            </div>
            <br/>
            <div className="modelParamRow">
                <div className="commonParamColumn">
                    <br/>
                    <div className="commonParamInfo">
                        <h2><b>모델 기본 설정</b></h2>
                    </div>
                    <br/>
                    <div className="commonParamBoxes">
                        <div className="startDateRow">
                            <div className="startDateInfo">
                                <p><b>시작일</b></p>
                            </div>
                            <div className="startDateBox">
                                <input className="predDateBtn" name="startDate" type="date" onChange={onChange}/>
                            </div>
                        </div>
                        <div className="endDateRow">
                            <div className="endDateInfo">
                                <p><b>마지막일</b></p>
                            </div>
                            <div className="endDateBox">
                                <input className="predDateBtn" name="endDate" type="date" onChange={onChange}/>
                            </div>
                        </div>
                        <br/>
                        <div className="epochBoxRow">
                            <div className="epochBoxInfo">
                                <p><b>Epoch</b></p>
                            </div>
                            <div className="epochInputBox">
                                <Form.Control className={styles.predEpochBox} name="epoch" type="number" placeholder="ex) 100" onChange={onChange}/>
                            </div>
                        </div>
                        <br/>
                        <div className="predColumnChkBoxRow">
                            <div className="predColumnChkBoxInfo">
                                <p><b>예측 기준 컬럼</b></p>
                            </div>
                            <div className="predColumnChkBoxList">
                                <label htmlFor="">시가</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="Open"
                                            type="checkbox"
                                            onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                                <label htmlFor="">고가</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="High"
                                            type="checkbox"
                                            onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                                <label htmlFor="">저가</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="Low" type="checkbox"
                                            onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                                <label htmlFor="">종가</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="Close"
                                            type="checkbox"
                                            onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                                <label htmlFor="">거래량</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="Volumne"
                                            type="checkbox"
                                            onChange={handleCheckboxChange}/>
                            </div>
                        </div>
                        <br/>
                        <div className="targetColumnSelectBoxRow">
                            <div className="targetColumnSelectInfo">
                                <p><b>예측 목표 컬럼</b></p>
                            </div>
                            <div className="targetColumnSelectBoxes">
                                <Form.Select className={styles.predTargetColumnSelBox} name="targetColumn"
                                             onChange={onChangeTarget}>
                                    <option value="Open">시가</option>
                                    <option value="High">고가</option>
                                    <option value="Low">저가</option>
                                    <option value="Close">종가</option>
                                    <option value="Volumne">거래량</option>
                                </Form.Select>
                            </div>
                        </div>
                        <br/><br/>
                    </div>
                </div>
                <div className="paidParamColumn">
                    <br/>
                    <div className="paidParamInfo">
                        <h2><b>유료 파라미터</b></h2>
                    </div>
                    {isPaidPlan ? (
                        <div className="paidParamBoxes">
                            <br/>
                            <div className="pastPredDaysRow">
                                <div className="pastPredDaysInfo">
                                    <p><b>과거 N일 예측</b></p>
                                </div>
                                <div className="pastPredDaysBox">
                                    <Form.Control name="pastPredDays" type="number" placeholder="ex) 30 = 과거30일치 데이터로 학습"
                                                  onChange={onChange}/>
                                </div>
                            </div>
                            <br/>
                            <div className="trainTestSplitRow">
                                <div className="trainTestSplitInfo">
                                    <p><b>Train/Test Split 비율</b></p>
                                </div>
                                <div className="trainTestSplitBox">
                                    <Form.Control name="trainTestSplit" type="number"
                                                  placeholder="ex) 30 = Train 70 : Test 30" onChange={onChange}/>
                                </div>
                            </div>
                            <br/>
                            <div className="validPerRow">
                                <div className="validPerInfo">
                                    <p><b>Validation Data 비율</b></p>
                                </div>
                                <div className="validPerBox">
                                    <Form.Control name="validPercentage" type="number" placeholder="ex) 10 = Train데이터의 10%를 검증에 사용" onChange={onChange}/>
                                </div>
                            </div>
                            <br/>
                            <div className="batchSizeRow">
                                <div className="batchSizeInfo">
                                    <p><b>Batch size</b></p>
                                </div>
                                <div className="batchSizeBox">
                                    <Form.Control name="batchSize" type="number" placeholder="기본값:30" onChange={onChange}/>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="paidParamBoxes">
                            <div>
                                <h5 className={styles.boldFont}>※유료회원 전용 커스터마이징 필드입니다.</h5>
                            </div>
                            <div>
                                <Form.Control placeholder="pastPredDays:30" disabled={true}/>
                            </div>
                            <br/>
                            <div>
                                <Form.Control placeholder="trainTestSplit:30" disabled={true}/>
                            </div>
                            <br/>
                            <div>
                                <Form.Control placeholder="validPercentage:10" disabled={true}/>
                            </div>
                            <br/>
                            <div>
                                <Form.Control  placeholder="batchSize:30" disabled={true}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <br/>
            <div className="predictBtnRow">
                {isDisabled?(
                    <Button className="predBtn" variant="danger" onClick={doPredict} disabled={isDisabled}>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    </Button>
                ):(
                    <Button className="predBtn" variant="danger" onClick={doPredict} disabled={isDisabled}>
                        <h3>예측하기</h3>
                    </Button>
                )
                }
            </div>
            <br/>
            {isRstLoaded?(
                <div className="predictRstRow">
                    <div className="testRstColumn">
                        <br/>
                        <div className="testRstInfo">
                            <h2><b>Test 데이터 결과</b></h2>
                        </div>
                        <div className="testRstChart">
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={chartData}
                                options={chartOptions}
                            />
                        </div>
                        <br/>
                    </div>
                    <div className="marcapRstColumn">
                        <br/>
                        <div className="marcapRstInfo">
                            <h2><b>전일대비 등락률 예상</b></h2>
                        </div>
                        <div className="marcapRstChart">
                            <Chart
                                chartType="PieChart"
                                width="100%"
                                height="300px"
                                data={marcapValue}
                                options={marcapDonutChartOptions}
                            />
                        </div>
                        <br/>
                        <div className="marcapRstValueRow">
                            <div>
                                <h5><b>오늘값 :  </b> <b className="marcapRstValue">{todayValue.toLocaleString()}</b></h5>
                            </div>
                            <div>
                                <h5><b>내일예상값:  </b> <b className="marcapRstValue">{tomorrowValue.toLocaleString()}</b></h5>
                            </div>
                        </div>
                        <br/>
                        <br/>
                    </div>
                    <br/>
                </div>
            ):(
                <div></div>
            )}
        </div>
    )
}

export default StockPredictPage;