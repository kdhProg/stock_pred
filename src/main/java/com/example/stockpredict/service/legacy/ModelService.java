package com.example.stockpredict.service.legacy;

import com.example.stockpredict.request.legacy.PredictRequest;
import com.example.stockpredict.response.legacy.CsvInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ModelService {

    private final ObjectMapper objectMapper;

    public CsvInfo getCsvInfo(){
        try {

//            Path currentPath = Paths.get("");
//            String path = currentPath.toAbsolutePath().toString();
//            System.out.println(">>>>>>>>>>>>"+ path);

            String PATH = ".\\python_modules\\showAnalysis.py";

            ProcessBuilder processBuilder = new ProcessBuilder("python",PATH );
            Process process = processBuilder.start();
            
            // content가 null이라며 파이썬 못읽어오는 경우 -> 99% 파이썬 실행 환경 관련 문제(자바는 문제없을가능성99%)
            // 20240510 에러 - 파이썬 측에서 pandas를 찾지못함 --> 전역이 아니라 별개의 실행환경이 만들어진것 같은데 확인 필요

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(),"euc-kr"));

            String line = reader.readLine();
            if(line == null){
                return CsvInfo.builder().name("None").rows(0).columns(new ArrayList<>()).build();
            }
            CsvInfo csvInfo = objectMapper.readValue(line, CsvInfo.class);

            return csvInfo;
        } catch(IOException e){
            e.printStackTrace();
        }

        return null;
    }


    public String showSearchResult(String ticker, String startDate, String endDate){
        try {

            String PATH = ".\\python_modules\\yfinance\\showSearchRst.py";

            ProcessBuilder processBuilder = new ProcessBuilder("python", PATH, ticker,startDate,endDate);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(),"euc-kr"));

            String rst = reader.readLine();
            if(rst == null || rst.equals("")){
                return "error";
            }
            return rst;

        } catch(IOException e){
            e.printStackTrace();
        }
        return "";
    }


    public String[] showCsvList() {

        String PATH = ".\\python_modules\\csvFiles";
        File dir = new File(PATH);

        String[] filenames = dir.list();

        return filenames;
    }


    public String[] showModelList() {

        String PATH = ".\\python_modules\\predictionModels";
        File dir = new File(PATH);

        String[] filenames = dir.list();

        return filenames;
    }



    public String predict(PredictRequest req) {
        try {

            String CSV = req.getCsvName();
            String MODEL = ".\\python_modules\\predictionModels\\" + req.getModelName();

            ProcessBuilder processBuilder = new ProcessBuilder("python", MODEL, CSV);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(),"euc-kr"));

            String rst = "";
            while (reader.readLine() != null) {
                rst = reader.readLine();
            }

            if(rst == null || rst.equals("")){
                return "error";
            }
            return rst;

        } catch(IOException e){
            e.printStackTrace();
        }
        return "";
    }
}
