package com.example.stockpredict.request.post;

import com.querydsl.core.types.OrderSpecifier;
import lombok.Builder;
import lombok.Getter;

import static java.lang.Math.max;
import static java.lang.Math.min;

/*
*
* Service <-> Repository 간의 통신을 위한 DTO
* PostService : getPosts  <-> PostRepositoryCustomImpl : getPosts
*
* */
@Builder
@Getter
public class PostSearchReqGetPostsDTO {

    private Integer MAX_SIZE;

    private Integer page;

    private Integer size ;

    private OrderSpecifier<?> sort;

    private Integer category;

    private String keyword;

    /*
     * 페이지 번호와 페이지 크기를 기반으로 데이터베이스 쿼리에서 사용할 시작 위치(offset)를 계산
     * QueryDSL에서 offset의 첫 기준은 1이 아니라 0임을 고려
     * */
    public long getOffset(){
        return (long)(max(1,page)-1)* min(size,MAX_SIZE);
    }

}
