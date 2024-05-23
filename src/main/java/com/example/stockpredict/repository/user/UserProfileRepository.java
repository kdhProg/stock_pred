package com.example.stockpredict.repository.user;

import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.domain.user.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {

    Optional<UserProfile> findByUser(User user);

}
