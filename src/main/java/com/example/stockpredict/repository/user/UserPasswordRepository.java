package com.example.stockpredict.repository.user;

import com.example.stockpredict.domain.user.UserPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPasswordRepository extends JpaRepository<UserPassword, Integer> {
}
