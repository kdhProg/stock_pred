package com.example.stockpredict.request.prediction;

import jakarta.validation.constraints.NotBlank;
import lombok.*;


/*
* Todo 다른 controller의 @ModelAttribute 객체는 Setter가 없어도 되는데 이 객체는 달아야 정상 바인딩 됨
*
* */

@Getter
@Setter
@Builder
public class ShowSelectedEntireDataRequest {

    /* 조회 가능 컬럼 : OHLCV */
    private String colName;

    private String startDate;

    private String endDate;

    private String ticker;
}
