package com.example.stockpredict.controller.prediction;

import com.example.stockpredict.service.legacy.ModelService;
import com.example.stockpredict.service.prediction.PredictService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pred")
@RequiredArgsConstructor
public class PredictController {

    private final PredictService predictService;
    private final ModelService modelService;

    @GetMapping("/stockNameSearch")
    public String stockNameSearch(@RequestParam String keyword) {
        return predictService.dailyStockSearchHandler(keyword);
    }

}
