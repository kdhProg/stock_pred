package com.example.stockpredict.service.post;

import com.example.stockpredict.config.security.UserPrincipal;
import com.example.stockpredict.domain.post.board.Post;
import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.exception.post.PostNotFoundException;
import com.example.stockpredict.repository.post.PostRepository;
import com.example.stockpredict.repository.user.UserRepository;
import com.example.stockpredict.request.post.PostEditRequest;
import com.example.stockpredict.request.post.PostSaveRequest;
import com.example.stockpredict.response.post.PostResponse;
import com.example.stockpredict.service.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;


    public void savePost(PostSaveRequest req, UserPrincipal userPrincipal) {

        User user = userRepository.findByUserAccount(userPrincipal.getUserAccount()).get();

        /*
        * req에 builder.default로 기본값을 설정했으나, 이 메서드에서는 req를 빌더를 통해 객체를 생성하는게 아니라
        * 요청을 받는 DTO의 역할만 하므로 넘어오지 않은 값에 대해서 고려필요
        * */

        Post post = Post.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .user(user)
                .category(req.getCategory())
                .isImportant(req.getIsImportant())
                .likes(req.getLikes())
                .reports(req.getReports())
                .isSecret(req.getIsSecret())
                .createdAt(req.getCreatedAt())
                .updateDate(req.getUpdateDate())
                .build();

        postRepository.save(post);
    }

    public PostResponse getOnePostByPostId(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(PostNotFoundException::new);
        return PostResponse.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .category(post.getCategory())
                .isImportant(post.getIsImportant())
                .likes(post.getLikes())
                .reports(post.getReports())
                .isSecret(post.getIsSecret())
                .createdAt(post.getCreatedAt())
                .updateDate(post.getUpdateDate())
                .build();
    }






    @Transactional
    public void editPost(Long postId, PostEditRequest req) {
        Post post = postRepository.findById(postId).orElseThrow(PostNotFoundException::new);
        post.editPost(req);
    }


    public void deleteOne(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(PostNotFoundException::new);
        postRepository.delete(post);
    }


}
