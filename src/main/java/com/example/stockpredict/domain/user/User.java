package com.example.stockpredict.domain.user;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.CascadeType.ALL;

@Entity
@Table(name="USER")
@Getter
@NoArgsConstructor
public class User {

    /* 기본키 id */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* 매핑 필드 */
    @OneToOne(mappedBy = "user",cascade = ALL)
    private UserPassword userPassword;

    @OneToOne(mappedBy = "user",cascade = ALL)
    private UserProfile userProfile;

    @OneToOne(mappedBy = "user",cascade = ALL)
    private UserSubscription userSubscription;


    /* 유저 아이디 - 이메일 형식 */
    @Column(name="USER_ACCOUNT",unique=true,nullable = false)
    private String userAccount;


    @Builder
    public User(String userAccount){
        this.userAccount = userAccount;
    }


}
