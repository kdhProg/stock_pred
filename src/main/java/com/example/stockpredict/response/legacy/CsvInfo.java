package com.example.stockpredict.response.legacy;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;

@Getter
@Setter
@ToString
public class CsvInfo {

    private String name;
    private ArrayList<String> columns;
    private Integer rows;

    @Builder
    public CsvInfo(String name, ArrayList<String> columns, Integer rows) {
        this.name = name;
        this.columns = columns;
        this.rows = rows;
    }
}
