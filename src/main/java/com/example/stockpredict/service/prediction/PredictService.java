package com.example.stockpredict.service.prediction;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PredictService {

    private String DAILY_STOCK_FILEPATH = ".\\stock_property_files\\kor_stock_list.csv";

    private final ObjectMapper objectMapper;

    /* 주식목록 CSV를 읽어 List 반환 */
    public List<String[]> getDailyStockCsv(){
        List<String[]> records = new ArrayList<>();
        String line;
        String csvSeparator = ",";

        try (BufferedReader br = new BufferedReader(new FileReader(DAILY_STOCK_FILEPATH))) {
            while ((line = br.readLine()) != null) {
                String[] values = line.split(csvSeparator);
                records.add(values);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return records;

    }

    /* 리스트를 받아 키워드 검색 */
    public List<String> searchWithKeyword(List<String> list, String keyword) {
        return list.stream()
                .filter(str -> str.contains(keyword))
                .collect(Collectors.toList());
    }

    /* 특정 키워드가 있는 결과를 리스트에 담아 반환 */
    public List<String> dailyStockSearchHandler(String keyword) {
        List<String[]> records = getDailyStockCsv();
        List<String> companyNames = new ArrayList<>();

        for (String[] record : records) {
            companyNames.add(record[2]);
        }

        return searchWithKeyword(companyNames, keyword);
    }



}
