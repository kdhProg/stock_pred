package com.example.stockpredict.service.post;

import com.example.stockpredict.config.security.UserPrincipal;
import com.example.stockpredict.domain.post.board.Post;
import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.exception.post.PostNotFoundException;
import com.example.stockpredict.repository.post.PostRepository;
import com.example.stockpredict.repository.user.UserRepository;
import com.example.stockpredict.request.post.*;
import com.example.stockpredict.response.post.PostResponse;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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


    /*
    * Todo N건 조회 고려사항 : 현재 검색어 입력값을 그대로 쿼리에 넣는데 보안상 문제없는가? - 별도의 필터 추가해야 하는가?
    * */

    public List<PostResponse> getPosts(PostSearchRequest req) {
        PostSearchReqGetPostsDTO.PostSearchReqGetPostsDTOBuilder dto = PostSearchReqGetPostsDTO.builder()
                .MAX_SIZE(req.getMAX_SIZE())
                .page(req.getPage())
                .size(req.getSize())
                .category(req.getCategory())
                .keyword(req.getKeyword());

        PathBuilder<Post> pathBuilder = new PathBuilder<>(Post.class, "post");

        switch (req.getSort()) {
            case "postId":
                dto.sort(new OrderSpecifier<>(Order.DESC,pathBuilder.getString("postId")));
                break;

            case "likes":
                dto.sort(new OrderSpecifier<>(Order.DESC,pathBuilder.getString("likes")));
                break;

            case "reports":
                dto.sort(new OrderSpecifier<>(Order.DESC,pathBuilder.getString("reports")));
                break;

            case "updateDate":
                dto.sort(new OrderSpecifier<>(Order.DESC,pathBuilder.getString("updateDate")));
                break;
            case "":
                /* 비어있는 경우 처리 - postId기준 정렬 = 최신순 정렬 */
                dto.sort(new OrderSpecifier<>(Order.DESC,pathBuilder.getString("postId")));
                break;
            default:
                throw new IllegalArgumentException("허용되지 않은 sort값: " + req.getSort());
        }

        List<Post> posts = postRepository.getPosts(dto.build());

        /*
        *
        * map에서 PostResponse가 public임에도 접근할 수 없다는 에러
        * => chatGPT 답변
        * map 메서드는 함수형 인터페이스를 받아서 요소를 다른 요소로 매핑하는데 사용됩니다. 이 때,
        * 매핑할 함수가 PostResponse 클래스의 생성자인 경우, 해당 생성자가 올바르게 호출되어야 합니다.
        *  이 경우, PostResponse 클래스의 생성자는 Post 객체를 인자로 받아야 하며, Post 객체가 map 메서드에 의해 생성되는
        * 새로운 PostResponse 객체에 전달되어야 합니다. 따라서 PostResponse 클래스의 생성자가 Post 객체를 인자로 받는지 확인해 보세요.
        *
        * */


        return posts.stream().map(PostResponse::new).toList();
    }



    public Long getPostsCount(PostCountRequest req) {
        return postRepository.getPostsCount(req);
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
