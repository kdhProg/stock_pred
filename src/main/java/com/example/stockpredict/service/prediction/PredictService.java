package com.example.stockpredict.service.prediction;

import com.example.stockpredict.exception.python_modules.PythonModuleException;
import com.example.stockpredict.request.prediction.PredictModelRequest;
import com.example.stockpredict.request.prediction.ShowSelectedEntireDataRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PredictService {

    private String DAILY_STOCK_FILEPATH = ".\\stock_property_files\\kor_stock_list.csv";

    private final ObjectMapper objectMapper;

    /* 검색 키워드를 받아 ticker또는 기업명에 해당하는 JSON을 문자열 형태로 반환 */
    public String dailyStockSearchHandler(String keyword){
        try (BufferedReader br = new BufferedReader(new FileReader(DAILY_STOCK_FILEPATH))) {
            StringBuilder jsonBuilder = new StringBuilder();
            jsonBuilder.append("{");

            String line;
            boolean isFirstLine = true;

            // 첫 줄 (헤더) 건너뛰기
            br.readLine();

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                String ticker = values[1].trim();
                String corpName = values[2].trim();

                if(corpName.contains(keyword) || ticker.contains(keyword)){
                    if (!isFirstLine) {
                        jsonBuilder.append(", ");
                    } else {
                        isFirstLine = false;
                    }

                    jsonBuilder.append("\"").append(corpName).append("\": \"").append(ticker).append("\"");
                }else{
                    continue;
                }

            }

            jsonBuilder.append("}");

            String jsonString = jsonBuilder.toString();
            return jsonString;

        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }


    /* 현재 이용 가능 모델들 - 무료 */
    public String[] showFreeModelList() {
        String PATH = ".\\python_modules\\predictionModels\\freeModels";
        File dir = new File(PATH);

        String[] filenames = dir.list();

        return filenames;
    }

    /* 현재 이용 가능 모델들 - 유료 */
    public String[] showPaidModelList() {
        String PATH = ".\\python_modules\\predictionModels\\paidModels";
        File dir = new File(PATH);

        String[] filenames = dir.list();

        return filenames;
    }

    /* ticker에 해당하는 주식 정보 반환 */
    public String[] getTickerCorpInfo(String tickerInput) {
        String[] rst = {"","",""};
        try (BufferedReader br = new BufferedReader(new FileReader(DAILY_STOCK_FILEPATH))) {
            String line;
            // 첫 줄 (헤더) 건너뛰기
            br.readLine();

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                String ticker = values[1].trim();
                String corpName = values[2].trim();
                String market = values[3].trim();

                if(ticker.equals(tickerInput)){
                    rst[0] = ticker;
                    rst[1] = corpName;
                    rst[2] = market;
                    return rst;
                }

            }

        } catch (IOException e) {
            e.printStackTrace();

        }
        return rst;
    }


    /* 선택한 시작일,마지막일,ticker에 해당하는 주식 x값,y값 반환 */
    public String showSelectedEntireData(ShowSelectedEntireDataRequest req){
        try {

            String PATH = ".\\python_modules\\pykrx\\showSelectedEntireData.py";

            ProcessBuilder processBuilder =
                    new ProcessBuilder("python", PATH, req.getTicker(), req.getColName(),req.getStartDate(),req.getEndDate());
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(),"euc-kr"));

            String rst = reader.readLine();
            if(rst == null || rst.equals("")){
                throw new PythonModuleException();
            }
            return rst;

        } catch(IOException e){
            throw new PythonModuleException();
        }
    }


    /* free&payment 예측모델에 값 전달 + 결과Json전달 */
    public String doPredict(PredictModelRequest req) {
        try {

            String PATH = ".\\python_modules\\predictionModels";
            if(req.getIsFreeModel()){
                PATH += "\\freeModels\\";
            }else{
                PATH += "\\paidModels\\";
            }
            PATH += req.getModelFileName();

            // 파이썬 전달용 변수
            Map<String, Object> data = new HashMap<>();
            data.put("ticker", req.getTicker());
            data.put("startDate", req.getStartDate());
            data.put("endDate", req.getEndDate());
            data.put("epoch", req.getEpoch().toString());
            data.put("predColumns", req.getPredColumns());
            data.put("targetColumn", req.getTargetColumn());
            data.put("pastPredDays", req.getPastPredDays());
            data.put("trainTestSplit", req.getTrainTestSplit());
            data.put("validPercentage", req.getValidPercentage());
            data.put("batchSize", req.getBatchSize());

            String jsonData = objectMapper.writeValueAsString(data);

            ProcessBuilder processBuilder = new ProcessBuilder("python", PATH);

            Process process = processBuilder.start();
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(jsonData);
                writer.flush();
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
//                String line;
//                while ((line = reader.readLine()) != null) {
//                    System.out.println(line);
//                }
//                return line;
                String rst = reader.readLine();
                if(rst == null || rst.equals("")){
                    throw new PythonModuleException();
                }
                return rst;
            }

        } catch(IOException e){
            throw new PythonModuleException();
        }
    }
}
