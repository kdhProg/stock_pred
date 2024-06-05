import React, {useEffect, useState} from "react";
import axios from "axios";
import SelectedDatasetPreview from "../components/SelectedDatasetPreview";
import {Chart} from "react-google-charts";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useParams} from "react-router-dom";
import styles from "../css/StockPredictPage.module.css"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Spinner} from "react-bootstrap";

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

        /* 적절하지 않은 예상값 : 100%이상 증감 --> 이 나와도 그래프는 일단 100으로 표시 */
        const marpcapPercentage = Math.min(Math.abs(marcapVal) * 100,100);
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
        // tooltip: { trigger: 'none' },
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
        <div>
            <Container>
                <br/>
                <Row className={styles.corpInfoRow}>
                    <Col>
                        <br/>
                        <Row>
                            <h4 className={styles.boldFont}>Ticker</h4>
                        </Row>
                        <br/>
                        <Row>
                            <p className={styles.corpInfoText}>{corpInfo[0]}</p>
                        </Row>
                        <br/>
                    </Col>
                    <Col>
                        <br/>
                        <Row>
                            <h4 className={styles.boldFont}>기업명</h4>
                        </Row>
                        <br/>
                        <Row>
                            <p className={styles.corpInfoText}>{corpInfo[1]}</p>
                        </Row>
                        <br/>
                    </Col>
                    <Col>
                        <br/>
                        <Row>
                            <h4 className={styles.boldFont}>주식시장</h4>
                        </Row>
                        <br/>
                        <Row>
                            <p className={styles.corpInfoText}>{corpInfo[2]}</p>
                        </Row>
                        <br/>
                    </Col>
                    <br/>
                </Row>
                <br/>
                <SelectedDatasetPreview ticker={corpInfo[0]}/>
                <br/>
                <Row className={styles.modelSelectRow}>
                    <Col className={styles.freeModelCol}>
                        <br/>
                        <Row>
                            <h2 className={styles.boldFont}>무료 모델</h2>
                        </Row>
                        <br/>
                        {freeModels.map((modelName) => (
                        <div key={modelName} className={styles.modelRow}>
                            <Row>
                                <Col md={2}/>
                                <Col className={styles.modelLabelNForm}>
                                    <label htmlFor={modelName}>{modelName.slice(0, -3)}</label>
                                    <Form.Check id={modelName} type="radio" name="predModel" value={modelName}
                                                onChange={freeModelChange}/>
                                </Col>
                                <Col md={2}/>
                            </Row>
                            <br/>
                        </div>
                        ))}
                        <br/>
                    </Col>
                    <Col className={styles.paidModelCol}>
                        <br/>
                        <Row>
                            <h2 className={styles.boldFont}>유료 모델</h2>
                        </Row>
                        <br/>
                        {isPaidPlan ? (
                            <span>
                                {paidModels.map((modelName) => (
                                    <div key={modelName} className={styles.modelRow}>
                                        <Row>
                                            <Col md={2}/>
                                            <Col className={styles.modelLabelNForm}>
                                                <label htmlFor={modelName}>{modelName.slice(0, -3)}</label>
                                                <Form.Check id={modelName} type="radio" name="predModel"
                                                            value={modelName}
                                                            onChange={paidModelChange}/>
                                            </Col>
                                            <Col md={2}/>
                                        </Row>
                                        <br/>
                                    </div>
                                ))}
                            </span>
                        ) : (
                            <Row>
                                <p>유료회원 전용입니다.</p>
                            </Row>

                        )}
                    </Col>
                </Row>
                <br/>
                <Row className={styles.modelParamRow}>
                    <Col>
                        <br/>
                        <Row>
                            <h2 className={styles.boldFont}>모델 기본 설정</h2>
                        </Row>
                        <br/>
                        <Row>
                            <Col md={3}>
                                <p className={styles.boldFont}>
                                    시작일
                                </p>
                                <p className={styles.boldFont}>
                                    마지막일
                                </p>
                            </Col>
                            <Col>
                                <input  className={styles.predDateBtn}name="startDate" type="date" onChange={onChange}/>
                                <br/><br/>
                                <input  className={styles.predDateBtn} name="endDate" type="date" onChange={onChange}/>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col md={3}>
                                <p className={styles.boldFont}>Epoch</p>
                            </Col>
                            <Col md={2}/>
                            <Col>
                                <Form.Control className={styles.predEpochBox} name="epoch" type="number" placeholder="ex) 100" onChange={onChange}/>
                            </Col>
                            <Col md={2}/>
                        </Row>
                        <br/>
                        <Row>
                            <Col md={3}>
                                <p className={styles.boldFont}>예측 기준 컬럼</p>
                            </Col>
                            <Col className={styles.predColumnsBoxes}>
                                <label htmlFor="">시가</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="Open" type="checkbox"
                                       onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                                <label htmlFor="">고가</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="High" type="checkbox"
                                       onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                                <label htmlFor="">저가</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="Low" type="checkbox"
                                       onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                                <label htmlFor="">종가</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="Close" type="checkbox"
                                       onChange={handleCheckboxChange}/>&nbsp;&nbsp;
                                <label htmlFor="">거래량</label>
                                <Form.Check className={styles.predColumn} name="predColumns" value="Volumne" type="checkbox"
                                       onChange={handleCheckboxChange}/>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col md={3}>
                                <p className={styles.boldFont}>예측 목표 컬럼</p>
                            </Col>
                            <Col md={2}/>
                            <Col>
                                <Form.Select className={styles.predTargetColumnSelBox} name="targetColumn" onChange={onChangeTarget}>
                                    <option value="Open">시가</option>
                                    <option value="High">고가</option>
                                    <option value="Low">저가</option>
                                    <option value="Close">종가</option>
                                    <option value="Volumne">거래량</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}/>
                        </Row>
                        <br/><br/>
                    </Col>
                    <Col>
                        <br/>
                        <Row>
                            <h2 className={styles.boldFont}>유료 파라미터</h2>
                        </Row>
                        {isPaidPlan ? (
                            <div>
                                <Row>
                                    <Col md={3}>
                                        <p className={styles.boldFont}>과거 N일 예측</p>
                                    </Col>
                                    <Col md={1}/>
                                    <Col>
                                        <Form.Control name="pastPredDays" type="number" placeholder="ex) 30 = 과거30일치 데이터로 학습" onChange={onChange}/>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                                <br/>
                                <Row>
                                    <Col md={3}>
                                        <p className={styles.boldFont}>Train/Test 비율</p>
                                    </Col>
                                    <Col md={1}/>
                                    <Col>
                                        <Form.Control name="trainTestSplit" type="number" placeholder="ex) 30 = Train 70 : Test 30" onChange={onChange}/>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                                <br/>
                                <Row>
                                    <Col md={3}>
                                        <p className={styles.boldFont}>Validation 비율</p>
                                    </Col>
                                    <Col md={1}/>
                                    <Col>
                                        <Form.Control name="validPercentage" type="number" placeholder="ex) 10 = Train데이터의 10%를 검증에 사용" onChange={onChange}/>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                                <br/>
                                <Row>
                                    <Col md={3}>
                                        <p className={styles.boldFont}>Batch Size</p>
                                    </Col>
                                    <Col md={1}/>
                                    <Col>
                                        <Form.Control name="batchSize" type="number" placeholder="기본값:30" onChange={onChange}/>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                            </div>
                        ) : (
                            <div>
                                <Row>
                                    <h5 className={styles.boldFont}>※유료회원 전용 커스터마이징 필드입니다.</h5>
                                </Row>
                                <Row>
                                    <Col md={3}>
                                        <p className={styles.boldFont}>과거 N일 예측</p>
                                    </Col>
                                    <Col md={1}/>
                                    <Col>
                                        <Form.Control placeholder="pastPredDays:30" disabled={true}/>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                                <br/>
                                <Row>
                                    <Col md={3}>
                                        <p className={styles.boldFont}>Train/Test 비율</p>
                                    </Col>
                                    <Col md={1}/>
                                    <Col>
                                        <Form.Control placeholder="trainTestSplit:30" disabled={true}/>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                                <br/>
                                <Row>
                                    <Col md={3}>
                                        <p className={styles.boldFont}>Validation 비율</p>
                                    </Col>
                                    <Col md={1}/>
                                    <Col>
                                        <Form.Control placeholder="validPercentage:10" disabled={true}/>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                                <br/>
                                <Row>
                                    <Col md={3}>
                                        <p className={styles.boldFont}>Batch Size</p>
                                    </Col>
                                    <Col md={1}/>
                                    <Col>
                                        <Form.Control  placeholder="batchSize:30" disabled={true}/>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                            </div>
                        )}
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        {isDisabled?(
                            <Button className={styles.predBtn} variant="danger" onClick={doPredict} disabled={isDisabled}>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            </Button>
                        ):(
                            <Button className={styles.predBtn} variant="danger" onClick={doPredict} disabled={isDisabled}>
                                <h3>예측하기</h3>
                            </Button>
                        )
                        }
                    </Col>
                </Row>
                <br/>
                {isRstLoaded?(
                    <div className={styles.predRstDiv}>
                    <br/><br/>
                    <Row>
                        <Col md={1}/>
                        <Col md={6}>
                            <h2 className={styles.boldFont}>Test데이터 결과</h2>
                        </Col>
                        <Col md={4}>
                            <h2 className={styles.boldFont}>전일대비 등락률 예상</h2>
                        </Col>
                        <Col md={1}/>
                    </Row>
                        <br/>
                    <Row >
                        <Col md={1}/>
                        <Col md={6}>
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={chartData}
                                options={chartOptions}
                            />
                        </Col>
                        <Col md={4}>
                            <Row>
                                <Chart
                                    chartType="PieChart"
                                    width="100%"
                                    height="300px"
                                    data={marcapValue}
                                    options={marcapDonutChartOptions}
                                />
                            </Row>
                            <br/>
                            <Row>
                                <Col>
                                    <h5 className={styles.boldFont}>오늘값: {todayValue.toLocaleString()}</h5>
                                </Col>
                                <Col>
                                    <h5 className={styles.boldFont}>내일예상값: {tomorrowValue.toLocaleString()}</h5>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={1}/>
                    </Row>
                    <br/><br/>
                    </div>
                ) : (
                    <div></div>
                )
                }
            </Container>
        </div>
    )
}

export default StockPredictPage;