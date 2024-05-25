package com.example.stockpredict.controller.post;

import com.example.stockpredict.config.security.UserPrincipal;
import com.example.stockpredict.request.post.PostEditRequest;
import com.example.stockpredict.request.post.PostSaveRequest;
import com.example.stockpredict.response.post.PostResponse;
import com.example.stockpredict.service.post.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/post")
public class PostController {

    private final PostService postService;

    /* 게시글 저장 */
    @PostMapping("/savePost")
    public void savePost(@RequestBody PostSaveRequest req,@AuthenticationPrincipal UserPrincipal userPrincipal){
        postService.savePost(req,userPrincipal);
    }

    /* 게시글 1개 조회 */
    @GetMapping("/{postId}")
    public PostResponse writePost(@PathVariable(name = "postId")Long postId){
        return postService.getOnePostByPostId(postId);
    }


    /* 게시글 N개 조회 */



    /* 게시글 수정 */
    /*
    * 엔티티의 일부만 수정할 수 있으므로 PUT 대신 PATCH
    *
    * */
    @PatchMapping("/{postId}")
    public void editPost(@PathVariable(name = "postId")Long postId,@RequestBody @Valid PostEditRequest req){
        postService.editPost(postId,req);
    }


    /* 게시글 삭제 */
    @DeleteMapping("/{postId}")
    public void deleteOne(@PathVariable(name = "postId")Long postId){
        postService.deleteOne(postId);
    }

}
