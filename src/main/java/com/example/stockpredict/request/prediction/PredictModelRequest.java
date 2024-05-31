package com.example.stockpredict.request.prediction;


import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/*
 *
 * 기존(커스텀모델X) Python 예측 모듈에 전송할 값 모음
 *
 * */
@Getter
@Setter
@ToString
public class PredictModelRequest {

    /*
    * 무료&유료 공통
    * Ticker / 시작일 / 마지막일 / 모델 Epoch / 예측시 컬럼N / 결과 컬럼 : 1
    * Epoch = default : 100
    *
    * [무료]
    * PAST_PRED_DAYS = default : 30
    * train / test = default : 70/30
    * Validation = default : 0.1
    * BatchSize = default : 30
    *
    * [유료]
    * PAST_PRED_DAYS
    * BatchSize
    * train / test 비율
    * Validation 비율
     * */

    /* 무료&유료 여부 - service레이어 사용*/
    @NotBlank(message = "무료/유료 여부 boolean 필수")
    private Boolean isFreeModel;

    /* 모델 파일명 - service레이어 사용*/
    @NotBlank(message = "모델 파일명")
    private String modelFileName;

    /* Ticker */
    @NotBlank(message = "Ticker 필수")
    private String ticker;

    /* 예측 데이터 시작일 */
    @NotBlank(message = "시작일 필수")
    private String startDate;

    /* 예측 데이터 마지막일 */
    @NotBlank(message = "마지막일 필수")
    private String endDate;

    /* Epoch */
    private Integer epoch = 100;

    /* 예측 기준 컬럼 - 1 ~ N개 */
    private String[] predColumns;

    /* 예측 결과 컬럼* - 1개  */
    private String targetColumn;

    /* 과거 N일 */
    private Integer pastPredDays = 30;

    /* train & test split 기준 percentage */
    private Integer trainTestSplit = 30;

    /* validation percentage */
    private Integer validPercentage = 10;

    /* BatchSize */
    private Integer batchSize = 30;

}
