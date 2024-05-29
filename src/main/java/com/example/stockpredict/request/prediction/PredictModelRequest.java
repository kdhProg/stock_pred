package com.example.stockpredict.request.prediction;


import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

/*
 *
 * 기존(커스텀모델X) Python 예측 모듈에 전송할 값 모음
 *
 * */
@Builder
@Getter
public class PredictModelRequest {

    /* 예측 데이터 시작&마지막 날짜 */
    @NotBlank(message = "시작일 필수")
    public String startDate;

    @NotBlank(message = "마지막일 필수")
    public String endDate;

    /* train & test split 기준 percentage */
    @NotBlank(message = "train & test split 기준일 필수")
    public Integer splitPercentage;

    /* 과거 N일치로 예측 */
    @NotBlank(message = "N일 필수")
    public Integer predPastDays;
}
