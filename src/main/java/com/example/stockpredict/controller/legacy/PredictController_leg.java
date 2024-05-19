package com.example.stockpredict.controller.legacy;

import com.example.stockpredict.request.legacy.PredictRequest;
import com.example.stockpredict.service.legacy.ModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

//@RestController
@RequiredArgsConstructor
public class PredictController_leg {

    private final ModelService modelService;

//    @PostMapping("/showPredResult")
    public String showPredResult(@RequestBody PredictRequest req){
        return modelService.predict(req);
    }

}
