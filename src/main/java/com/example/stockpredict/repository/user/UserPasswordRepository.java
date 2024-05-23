package com.example.stockpredict.repository.user;

import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.domain.user.UserPassword;
import com.example.stockpredict.domain.user.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPasswordRepository extends JpaRepository<UserPassword, Integer> {

    Optional<UserPassword> findByUser(User user);
}
