package com.example.stockpredict.controller.prediction;

import com.example.stockpredict.request.prediction.ShowSelectedEntireDataRequest;
import com.example.stockpredict.service.legacy.ModelService;
import com.example.stockpredict.service.prediction.PredictService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pred")
@RequiredArgsConstructor
public class PredictController {

    private final PredictService predictService;
    private final ModelService modelService;

    /* 검색 키워드를 받아 ticker또는 기업명에 해당하는 JSON을 문자열 형태로 반환 */
    @GetMapping("/stockNameSearch")
    public String stockNameSearch(@RequestParam String keyword) {
        return predictService.dailyStockSearchHandler(keyword);
    }

    /* 현재 이용 가능 모델들 - 무료 */
    @GetMapping("/showFreeModelList")
    public String[] showFreeModelList(){
        return predictService.showFreeModelList();
    }

    /* 현재 이용 가능 모델들 - 유료 */
    @GetMapping("/showPaidModelList")
    public String[] showPaidModelList(){
        return predictService.showPaidModelList();
    }

    /* ticker에 해당하는 주식 정보 반환 */
    @GetMapping("/getTickerCorpInfo")
    public String[] getTickerCorpInfo(@RequestParam String ticker){
        return predictService.getTickerCorpInfo(ticker);
    }

    /* 선택한 시작일,마지막일,ticker에 해당하는 주식 x값,y값 반환 */
    @GetMapping("/showSelectedEntireData")
    public String showSelectedEntireData(@RequestBody @Valid ShowSelectedEntireDataRequest req){
        return predictService.showSelectedEntireData(req);
    }


}
