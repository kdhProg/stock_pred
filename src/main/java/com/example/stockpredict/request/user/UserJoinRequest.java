package com.example.stockpredict.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserJoinRequest {

    /* 필수 컬럼 - 아이디 + 비밀번호 + 전화번호 + 별명*/
    @NotBlank(message = "아이디는 필수입니다")
    private String userAccount;

    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
    
    @NotBlank(message = "전화번호는 필수입니다")
    private String phone;

    /* 별명 - 글 작성 시 필수이므로 필수 지정 */
    @NotBlank(message = "닉네임은 필수입니다")
    private String nickName;

    /* 주소 */
    private String address;

    /* 성별 */
    private String gender;


    /* 프로필이미지 경로 */
//    private String profileImage;

    /* 생일 */
    private String birth;

    /* 국가 */
    private String nation;

    /* 사용자 플랜 */
    @Builder.Default
    private Integer subscriptionPlan = 0;



}
