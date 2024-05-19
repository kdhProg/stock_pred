package com.example.stockpredict.request.legacy;


import lombok.*;

@Getter
@Setter
@ToString
public class StockSearchRequest {

    private String ticker;
    private String start_date;
    private String end_date;

    public StockSearchRequest(String ticker, String start_date, String end_date) {
        this.ticker = ticker;
        this.start_date = start_date;
        this.end_date = end_date;
    }
}
