package com.example.stockpredict.request.post;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostSaveRequest {

    @NotBlank(message = "제목 필수")
    private String title;

    @NotBlank(message = "내용 필수")
    private String content;

    @NotNull(message = "카테고리 필수")
    @Min(value = 0, message = "category 값은 0 이상")
    private Integer category;

    @Min(value = 0, message = "isImportant 값은 0 이상")
    private Integer isImportant = 0;

    @Min(value = 0, message = "likes 값은 0 이상")
    private Integer likes = 0;

    @Min(value = 0, message = "reports 값은 0 이상")
    private Integer reports = 0;

    @Max(value = 1, message = "isSecret 값은 0 or 1")
    @Min(value = 0, message = "isSecret 값은 0 or 1")
    private Integer isSecret = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updateDate = LocalDateTime.now();



}
