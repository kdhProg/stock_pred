package com.example.stockpredict.controller.legacy;

import com.example.stockpredict.response.legacy.CsvInfo;
import com.example.stockpredict.service.legacy.FileService;
import com.example.stockpredict.service.legacy.ModelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    private final ModelService modelService;

    /* 파일 업로드 */
    @PostMapping("/upload")
    public void fileUpload(@RequestParam("file") MultipartFile file) {
        fileService.fileUpload(file);
    }

    /* CSV 정보 보기 */
    @GetMapping("/showCsvInfo")
    public CsvInfo temp(){
        return modelService.getCsvInfo();
    }
}
