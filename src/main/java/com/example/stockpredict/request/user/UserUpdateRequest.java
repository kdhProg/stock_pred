package com.example.stockpredict.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserUpdateRequest {

    /*
    * 수정가능한 정보들 :
    * 아이디 + 주소, 전화번호, 성별, 별명, 생일, 국가
    *
    * */

    /* 바꿀 아이디 */
    /* 현재 유저 정보는 로그인 기반 AuthenticationPrincipal으로 찾음 */
    @NotBlank(message = "아이디는 필수")
    private String userAccount;

    /* 전화번호 */
    @NotBlank(message = "전화번호는 필수")
    private String phone;

    /* 주소 */
    private String address;

    /* 성별 */
    private String gender;

    /* 별명 */
    private String nickName;

    /* 프로필이미지 경로 */
//    private String profileImage;

    /* 생일 */
    private String birth;

    /* 국가 */
    private String nation;
}
