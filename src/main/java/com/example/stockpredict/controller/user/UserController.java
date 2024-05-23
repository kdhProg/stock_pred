package com.example.stockpredict.controller.user;

import com.example.stockpredict.config.security.UserPrincipal;
import com.example.stockpredict.request.user.UserJoinRequest;
import com.example.stockpredict.request.user.UserUpdateRequest;
import com.example.stockpredict.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;


    /*
     * 로그인, 로그아웃 => SecurityConfig
     * */

    /* 회원가입 */
    @PostMapping("/join")
    public void join(@RequestBody @Valid UserJoinRequest userJoinRequest){
        userService.userJoin(userJoinRequest);
    }

    /* 현재 로그인 사용자 정보(아이디)*/
    @GetMapping("/currentUserAccount")
    public String getUserInfo(@AuthenticationPrincipal UserPrincipal userPrincipal){
        return userPrincipal.getUserAccount();
    }

    /* 현재 로그인 사용자 구독여부  무료:0  유료:1 */
    @GetMapping("/currentUserPlan")
    public Integer currentUserPlan(@AuthenticationPrincipal UserPrincipal userPrincipal){
        return userService.getCurrentUserPlan(userPrincipal);
    }

    /* 아이디 중복 여부 반환 */
    @GetMapping("/chkIdDuplicate")
    public Boolean chkIdDuplicate(@RequestParam(name = "id") String id){
        return userService.chkIdDuplicate(id);
    }


    /* 유저정보 수정*/
    /*
    * 정책 : 선택정보만 변경가능
    * - 아이디는 변경불가
    * - 비밀번호는 재발급 형태로 구현
    * */
    @PutMapping("/updateUser")
    public void updateUser(@RequestBody UserUpdateRequest userUpdateRequest
    , @AuthenticationPrincipal UserPrincipal userPrincipal){
        userService.updateUser(userPrincipal.getUserAccount(),userUpdateRequest);
    }


}
