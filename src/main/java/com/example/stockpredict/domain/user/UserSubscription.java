package com.example.stockpredict.domain.user;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Table(name="USER_SUBSCRIPTION")
@NoArgsConstructor
@Getter
public class UserSubscription {

    /* 기본키  */
    /* 발급 코드 */
    // Todo 로그 남길 시 사용하기
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="USERSUBSCRIPTION_ID")
    private Long id;

    /* 외래키 */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ACCOUNT", referencedColumnName = "USER_ACCOUNT")
    private User user;


    /* 구독 유형 */
    // ex)  0 : 기본(무료)   1 : 유료
    @Column(name="SUBSCRIPTION_PLAN",nullable = false)
    @ColumnDefault("0")
    private Integer subscriptionPlan;

    /* 결제일 */
    @Column(name="PURCHASE_DATE")
    private LocalDateTime purchaseDate;

    /* 만료일 */
    @Column(name="EXPIRATION_DATE")
    private LocalDateTime expirationDate;


    @Builder
    public UserSubscription(User user,Integer subscriptionPlan, LocalDateTime purchaseDate, LocalDateTime expirationDate) {
        this.user = user;
        this.subscriptionPlan = subscriptionPlan;
        this.purchaseDate = purchaseDate;
        this.expirationDate = expirationDate;
    }
}
