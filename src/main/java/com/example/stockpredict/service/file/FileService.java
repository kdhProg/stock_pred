package com.example.stockpredict.service.file;

//import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@Slf4j
public class FileService {

    @Value("${app.upload.dir:${user.home}}")
    private String uploadDir;

    public void showCurrentLoc(){
        Path currentPath = Paths.get("");
        String path = currentPath.toAbsolutePath().toString();
        log.info("현재 작업 경로: {}", path);
    }

    public void fileUpload(MultipartFile multipartFile) {
        
        Path copyOfLocation = Paths.get(uploadDir + File.separator + StringUtils.cleanPath(multipartFile.getOriginalFilename()));
        try {
            Files.copy(multipartFile.getInputStream(), copyOfLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            // Todo 커스텀 익셉션 처리
            throw new RuntimeException("Could not store file : " + multipartFile.getOriginalFilename());
        }

    }


}
