package com.example.stockpredict.response.user;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserProfileResponse {

    /* 주소 */
    private String address;

    /* 전화번호 */
    private String phone;

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

    /* 가입일 */
    private LocalDateTime createdAt;

    /* 마지막 정보 수정일 */
    private LocalDateTime updateDate;

    @Builder
    public UserProfileResponse(String address, String phone, String gender, String nickName,
                               String birth, String nation, LocalDateTime createdAt, LocalDateTime updateDate) {
        this.address = address;
        this.phone = phone;
        this.gender = gender;
        this.nickName = nickName;
        this.birth = birth;
        this.nation = nation;
        this.createdAt = createdAt;
        this.updateDate = updateDate;
    }
}
