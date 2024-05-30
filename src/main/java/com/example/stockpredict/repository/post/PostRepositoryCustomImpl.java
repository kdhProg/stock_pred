package com.example.stockpredict.repository.post;

import com.example.stockpredict.domain.post.board.Post;
import com.example.stockpredict.request.post.PostCountRequest;
import com.example.stockpredict.request.post.PostSearchReqGetPostsDTO;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.example.stockpredict.domain.post.board.QPost.post;

@RequiredArgsConstructor
public class PostRepositoryCustomImpl implements PostRepositoryCustom{

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<Post> getPosts(PostSearchReqGetPostsDTO req) {
        return jpaQueryFactory
                .select(post)
                .from(post)
                .limit(req.getSize())
                .offset(req.getOffset())
                .where(
                        post.title.contains(req.getKeyword())
                                .and(post.category.eq(req.getCategory()))
                )
                .orderBy(req.getSort())
                .fetch();
    }

    @Override
    public Long getPostsCount(PostCountRequest req) {
        return jpaQueryFactory
                .select(post)
                .from(post)
                .where(
                        post.title.contains(req.getKeyword())
                                .and(post.category.eq(req.getCategory()))
                )
                .fetch()
                .stream().count();
    }


}
