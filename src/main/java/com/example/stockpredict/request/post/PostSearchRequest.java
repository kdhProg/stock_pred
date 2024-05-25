package com.example.stockpredict.request.post;

import com.example.stockpredict.domain.post.board.QPost;
import lombok.Builder;
import lombok.Getter;

import static java.lang.Math.max;
import static java.lang.Math.min;

@Getter
@Builder
public class PostSearchRequest {

    /* 한번에 로드할 최대 글 개수 */
    private final Integer MAX_SIZE = 2000;

    /* 페이지 */
    @Builder.Default
    private Integer page = 1;

    /* 로드할 크기 */
    @Builder.Default
    private Integer size = 10;

    /*
    *
    * 정렬기준 가능 컬럼
    * postId - 생성된 순서대로 부여되므로 post.postId.desc()와 같이 사용하면 최신순 정렬
    * likes - 추천수 정렬
    * reports - 신고수 정렬(관리자페이지에서 사용할 만한 요소)
    * updateDate - 최근 수정됨(관리자페이지에서 사용할 만한 요소)
    *
    * */
    private String sort;

    /*
    * 카테고리
    * ex)
    * 0 - 관리자페이지
    * 1 - 자유게시판
    * ....
    *  */
    private Integer category;


    /* 검색어 */
    private String keyword;


}
