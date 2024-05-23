package com.example.stockpredict.response.user;

import lombok.Getter;
import lombok.Setter;


/*
* 아이디 찾기 - 전화번호 기반 비밀번호 찾기 Response
*
* */

@Getter
@Setter
public class UserFindByPhoneResponse {

    /* 전화번호에 해당하는 유저가 있다면 True */
    private Boolean isUserExists;

    /* 전화번호에 해당하는 유저 아이디 */
    private String userAccount;

}
