package com.example.stockpredict.domain.post.board;

import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.request.post.PostEditRequest;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.*;


/*

 * 게시글 엔티티
 *
 * 카테고리 : 공지사항-0  자유게시판-1
 * 비밀글 : OFF-0  ON-1
 * 최상단 공지사항 : OFF-0  ON-1
 *
 *
 * */

@Entity
@Getter
@NoArgsConstructor
@Table(name="POST")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="POST_ID")
    private Long postId;

    /* 제목 */
    @Column(name = "TITLE",nullable = false)
    private String title;

    /* 내용 */
    @Lob
    @Column(name = "CONTENT",nullable = false)
    private String content;

    /* 작성자 */
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID ",nullable = false)
    private User user;

    /* 카테고리 */
    @Column(name="CATEGORY",nullable = false)
    private Integer category;

    /* 최상단 공지사항 등록 */
    @Column(name="IS_IMPORTANT",nullable = false)
    private Integer isImportant;

    /* 추천수 */
    @Column(name="LIKES",nullable = false)
    private Integer likes;

    /* 신고수 */
    @Column(name="REPORTS",nullable = false)
    private Integer reports;

    /* 비밀글 여부 */
    @Column(name="IS_SECRET",nullable = false)
    private Integer isSecret;

    /* 생성일 */
    @Column(name="CREATED_AT",nullable = false)
    private LocalDateTime createdAt;

    /* 마지막 수정일 */
    @Column(name="UPDATE_DATE",nullable = false)
    private LocalDateTime updateDate;


    @Builder
    public Post(String title, String content, User user, Integer category, Integer isImportant,
                Integer likes, Integer reports, Integer isSecret, LocalDateTime createdAt, LocalDateTime updateDate) {
        this.title = title;
        this.content = content;
        this.user = user;
        this.category = category;
        this.isImportant = isImportant;
        this.likes = likes;
        this.reports = reports;
        this.isSecret = isSecret;
        this.createdAt = createdAt;
        this.updateDate = updateDate;
    }


    public void editPost(PostEditRequest req) {
        this.title = req.getTitle();
        this.content = req.getContent();

        this.category = req.getCategory();
        this.isImportant = req.getIsImportant();
        this.isSecret = req.getIsSecret();

        this.updateDate = LocalDateTime.now();
    }

}
