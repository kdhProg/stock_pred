package com.example.stockpredict.service.legacy;

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
        
        // Todo 정책 -> 한개의 csv파일만 존재해야함 --> 하나있는데 하나더 업로드 시 익셉션 투척
        
//        showCurrentLoc();
        
        if(!chkExtension(multipartFile)){throw new RuntimeException();} //Todo csv아닐시 -> 커스텀 익셉션 처리
        
        Path copyOfLocation = Paths.get(uploadDir + File.separator + StringUtils.cleanPath(multipartFile.getOriginalFilename()));
        try {
            Files.copy(multipartFile.getInputStream(), copyOfLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
//            throw new FileStorageException("Could not store file : " + multipartFile.getOriginalFilename());
            throw new RuntimeException("Could not store file : " + multipartFile.getOriginalFilename());
        }

    }

    public boolean chkExtension(MultipartFile multipartFile) {
        String extension = StringUtils.getFilenameExtension(multipartFile.getOriginalFilename());
        return extension.equals("csv");
    }


}
