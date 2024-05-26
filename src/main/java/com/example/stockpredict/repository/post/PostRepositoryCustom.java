package com.example.stockpredict.repository.post;

import com.example.stockpredict.domain.post.board.Post;
import com.example.stockpredict.request.post.PostCountRequest;
import com.example.stockpredict.request.post.PostSearchReqGetPostsDTO;
import com.example.stockpredict.request.post.PostSearchRequest;

import java.util.List;

public interface PostRepositoryCustom{

    List<Post> getPosts(PostSearchReqGetPostsDTO req);

    Long getPostsCount(PostCountRequest req);

}
