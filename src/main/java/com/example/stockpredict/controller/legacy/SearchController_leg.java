package com.example.stockpredict.controller.legacy;


import com.example.stockpredict.request.legacy.StockSearchRequest;
import com.example.stockpredict.service.legacy.ModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

//@RestController
@RequiredArgsConstructor
public class SearchController_leg {

    private final ModelService modelService;

    /* 데이터 결과 리스트(CSV형태) */
//    @PostMapping("/showSearchResult")
    public String showSearchResult(@RequestBody StockSearchRequest req){
        return modelService.showSearchResult(req.getTicker(),req.getStart_date(),req.getEnd_date());
    }

    /* 폴더 내 CSV목록 */
//    @GetMapping("/showCsvList")
    public String[] showCsvList(){
        return modelService.showCsvList();
    }

    /* 폴더 내 모델 리스트 */
//    @GetMapping("/showModelList")
    public String[] showModelList(){
        return modelService.showModelList();
    }

}
