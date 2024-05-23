package com.example.stockpredict.repository.user;

import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.domain.user.UserProfile;
import com.example.stockpredict.domain.user.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Integer> {

    Optional<UserSubscription> findByUser(User user);
}
