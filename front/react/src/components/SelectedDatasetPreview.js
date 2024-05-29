import {useEffect, useState} from "react";
import axios from "axios";
import { Chart } from 'react-google-charts';

const SelectedDatasetPreview = (props) => {

    /* props */
    const ticker = props.ticker;

    /* 데이터 로드 여부 */
    const [isLoading, setIsLoading] = useState(true);

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
        await axios.get(`/pred/showSelectedEntireData?&ticker=${dataReq.ticker}&colName=${dataReq.colName}&startDate=${dataReq.startDate}&endDate=${dataReq.endDate}`)
            .then((res) => {
            setIsLoading(false);
            setChartData(makeProperDataForm(res.data));
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
            <label htmlFor="startDate">start date</label>
            <input id="startDate" type="date" name="startDate" onChange={onChangeDate}/>

            <label htmlFor="endDate">end date</label>
            <input id="endDate" type="date" name="endDate" onChange={onChangeDate}/>

            <br/>
            <h4>조회할 컬럼</h4>
            <label htmlFor="">시가</label>
            <input type="radio" name="colName" value="시가" onChange={handleRadioChange}/>&nbsp;&nbsp;
            <label htmlFor="">고가</label>
            <input type="radio" name="colName" value="고가" onChange={handleRadioChange}/>&nbsp;&nbsp;
            <label htmlFor="">저가</label>
            <input type="radio" name="colName" value="저가" onChange={handleRadioChange}/>&nbsp;&nbsp;
            <label htmlFor="">종가</label>
            <input type="radio" name="colName" value="종가" onChange={handleRadioChange}/>&nbsp;&nbsp;
            <label htmlFor="">거래량</label>
            <input type="radio" name="colName" value="거래량" onChange={handleRadioChange}/>


            <br/>
            <button onClick={showSelectedEntireData}>데이터 로드하기</button>
            <br/>
            <br/>
            <div>
                {isLoading ? (
                    <div>
                        ........loading.....
                    </div>
                ) : (
                    <div>
                        <Chart
                            chartType="LineChart"
                            width="100%"
                            height="700px"
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SelectedDatasetPreview;