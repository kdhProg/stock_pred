package com.example.stockpredict.service.prediction;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class DailyStockListInitializer {

    /* 하루마다 주식 목록 갱신 */
    /* todayStockList.py를 실행 - stock_property_files에 오늘 주식 목록 CSV 저장 */
    /* fixedDelay에 constant 사용 불가 */
    @Scheduled(fixedDelay = (1000 * 60 * 60 * 24))
    public void mkDailyStockListCsv() {
        try {

            String PATH = ".\\python_modules\\pykrx\\todayStockList.py";

            ProcessBuilder processBuilder = new ProcessBuilder("python", PATH);
            processBuilder.start();

        } catch(IOException e){
            e.printStackTrace();
        }
    }


}
