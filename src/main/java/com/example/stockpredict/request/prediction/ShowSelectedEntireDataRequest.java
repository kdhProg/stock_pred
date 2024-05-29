package com.example.stockpredict.request.prediction;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ShowSelectedEntireDataRequest {

    @NotBlank(message = "시작일 필수")
    private String startDate;

    @NotBlank(message = "마지막일 필수")
    private String endDate;

    @NotBlank(message = "ticker 필수")
    private String ticker;
}
