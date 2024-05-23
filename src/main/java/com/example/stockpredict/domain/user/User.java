package com.example.stockpredict.domain.user;

import com.example.stockpredict.request.user.UserUpdateRequest;
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
    @Column(name="USER_ID")
    private Long id;

    /*
    * Todo 고려해보기
    * - 하단에 매핑된 3개 필드는 각각 즉시로딩(EAGER)로 설정되어있다.
    * - 1:1 양방향 매핑 상태에서 지연로딩은 종종 LazyInitializationException를 유발한다
    * - 성능상 즉시로딩도 괜찮은가?
    * */
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


    public void setUserAccount(String newAccount) {
        userAccount = newAccount;
    }


}
