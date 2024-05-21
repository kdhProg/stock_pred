package com.example.stockpredict.controller.prediction;

import com.example.stockpredict.service.prediction.PredictService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/pred")
@RequiredArgsConstructor
public class PredictController {

    private final PredictService predictService;

    @GetMapping("/stockNameSearch")
    public List<String> stockNameSearch(@RequestParam("keyword") String keyword) {
        return predictService.dailyStockSearchHandler(keyword);
    }


}
