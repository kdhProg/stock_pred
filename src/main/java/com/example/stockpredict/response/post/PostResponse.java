package com.example.stockpredict.response.post;

import com.example.stockpredict.domain.post.board.Post;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class PostResponse {

    /* 글쓴이 - user의 nickname */
    private String author;

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

    @Builder
    public PostResponse(Long postId, String title, String content, Integer category,
                        Integer isImportant, Integer likes, Integer reports,
                        Integer isSecret, LocalDateTime createdAt, LocalDateTime updateDate,String author) {
        this.postId = postId;
        this.title = title;
        this.content = content;
        this.category = category;
        this.isImportant = isImportant;
        this.likes = likes;
        this.reports = reports;
        this.isSecret = isSecret;
        this.createdAt = createdAt;
        this.updateDate = updateDate;

        this.author = author;
    }

    /* N건 조회 map메서드가 사용 */
    public PostResponse(Post post) {
        this.postId = post.getPostId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.category = post.getCategory();
        this.isImportant = post.getIsImportant();
        this.likes = post.getLikes();
        this.reports = post.getReports();
        this.isSecret = post.getIsSecret();
        this.createdAt = post.getCreatedAt();
        this.updateDate = post.getCreatedAt();
        this.author = post.getUser().getUserProfile().getNickName();
    }
}
