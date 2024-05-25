package com.example.stockpredict.response.post;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PostResponse {

    private Long postId;

    private String title;

    private String content;

    private Integer category;

    private Integer isImportant;

    private Integer likes;

    private Integer reports;

    private Integer isSecret;

    private LocalDateTime createdAt;

    private LocalDateTime updateDate;


}
