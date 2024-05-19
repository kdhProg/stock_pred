package com.example.stockpredict.repository.user;

import com.example.stockpredict.domain.user.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Integer> {
}
