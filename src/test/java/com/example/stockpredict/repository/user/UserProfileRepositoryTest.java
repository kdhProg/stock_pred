package com.example.stockpredict.repository.user;

import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.request.user.UserJoinRequest;
import com.example.stockpredict.service.user.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserProfileRepositoryTest {

    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private UserProfileRepository profileRepository;

    @BeforeEach
    void cleanAll(){userRepository.deleteAll();}

    @Test
    @DisplayName("findByUser Test")
    void findByUserTest(){

        UserJoinRequest req = UserJoinRequest.builder()
                .userAccount("test1234")
                .password("qwer1234")
                .build();

        userService.userJoin(req);
        User user = userRepository.findByUserAccount("test1234").get();
        assertEquals(user.getUserAccount(),profileRepository.findByUser(user).get().getUser().getUserAccount());


    }

}