package com.example.stockpredict.request.legacy;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PredictRequest {

    private String modelName;
    private String csvName;

    public PredictRequest(String modelName, String csvName) {
        this.modelName = modelName;
        this.csvName = csvName;
    }
}
