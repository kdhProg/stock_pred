package com.example.stockpredict.domain.user;

import com.example.stockpredict.request.user.UserUpdateRequest;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="USER_PASSWORD")
@NoArgsConstructor
@Getter
public class UserPassword {

    /* 기본키 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="USERPASSWORD_ID")
    private Long id;

    /* 외래키 */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID")
    private User user;



    /* 암호화된 비밀번호 Encrypted Password */
    @Column(name="PASSWORD",nullable = false)
    private String password;

    /* 마지막 수정일 */
    @Column(name="UPDATE_DATE",nullable = false)
    private LocalDateTime updateDate;

    @Builder
    public UserPassword(User user, String password, LocalDateTime updateDate) {
        this.user = user;
        this.password = password;
        this.updateDate = updateDate;
    }

}
