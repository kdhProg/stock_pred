package com.example.stockpredict.domain.user;

import com.example.stockpredict.request.user.UserUpdateRequest;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


/*
* 부가 정보 테이블
* - 전화번호를 제외한 나머지는 필수 입력값 아님
* */

@Entity
@Table(name="USER_PROFILE")
@NoArgsConstructor
@Getter
public class UserProfile {

    /* 기본키  */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="USERPROFILE_ID")
    private Long id;

    /* 외래키 */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID")
    private User user;

    /* 전화번호 - 필수정보 */
    @Column(name="PHONE",unique=true,nullable = false)
    private String phone;

    /*
    * 하단은 선택입력가능 정보(null허용)
    * */

    /* 주소 */
    @Column(name="ADDRESS")
    private String address;

    /* 성별 */
    @Column(name="GENDER")
    private String gender;

    /* 별명 */
    @Column(name="NICKNAME")
    private String nickName;

    /* 프로필이미지 경로 */
//    @Column(name="PROFILE_IMAGE")
//    private String profileImage;

    /* 생일 */
    @Column(name="BIRTH")
    private String birth;

    /* 국가 */
    @Column(name="NATION")
    private String nation;

    /* 가입일 */
    @Column(name="CREATED_AT")
    private LocalDateTime createdAt;

    /* 마지막 정보 수정일 */
    @Column(name="UPDATE_DATE")
    private LocalDateTime updateDate;


    @Builder
    public UserProfile(User user, String address, String phone, String gender,
                       String nickName, String birth, String nation,
                       LocalDateTime createdAt, LocalDateTime updateDate)
    {
        this.user = user;
        this.address = address;
        this.phone = phone;
        this.gender = gender;
        this.nickName = nickName;
//        this.profileImage = profileImage;
        this.birth = birth;
        this.nation = nation;
        this.createdAt = createdAt;
        this.updateDate = updateDate;
    }


    public void edit(UserUpdateRequest req)
    {
        address = req.getAddress();
        phone = req.getPhone();
        gender = req.getGender();
        nickName = req.getNickName();
//        this.profileImage = profileImage;
        birth = req.getBirth();
        nation = req.getNation();

        updateDate = LocalDateTime.now();
    }


}
