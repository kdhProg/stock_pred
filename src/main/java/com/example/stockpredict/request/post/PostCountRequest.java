package com.example.stockpredict.request.post;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PostCountRequest {

    /* 카테고리 */
    @Builder.Default
    private Integer category = 0;

    /* 검색어 */
    @Builder.Default
    private String keyword = "";

}
