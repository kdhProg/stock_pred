package com.example.stockpredict.controller.file;


import com.example.stockpredict.service.file.FileService;
import com.example.stockpredict.service.legacy.ModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/file")
public class FileController {

    /* Todo 추후 계정당 프로필 이미지 기능 추가시 사용 */

    private final FileService fileService;


    @PostMapping("/upload")
    public void fileUpload(@RequestParam("file") MultipartFile file) {
        fileService.fileUpload(file);
    }

}
