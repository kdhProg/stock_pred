package com.example.stockpredict.controller.user;

import com.example.stockpredict.config.security.UserPrincipal;
import com.example.stockpredict.request.user.UserJoinRequest;
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

    /* 회원가입 */
    @PostMapping("/join")
    public void join(@RequestBody @Valid UserJoinRequest userJoinRequest){
        userService.userJoin(userJoinRequest);
    }

    /*
    * 로그인, 로그아웃 => SecurityConfig
    * */

    /* 현재 로그인 사용자 정보 */
    @GetMapping("/currentInfo")
    public String getUserInfo(@AuthenticationPrincipal UserPrincipal userPrincipal){
        return userPrincipal.getUserAccount();
    }


}
