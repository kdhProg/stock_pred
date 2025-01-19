package com.example.stockpredict.repository.user;


import com.example.stockpredict.request.user.UserJoinRequest;
import com.example.stockpredict.service.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class UserRepositoryTest {


    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;


    @BeforeEach
    void clean(){
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("findByUserAccount 테스트")
    void findByUserAccountTest(){
        UserJoinRequest req = UserJoinRequest.builder()
                .userAccount("test1234")
                .password("qwer1234")
                .phone("1111")
                .nickName("aaa")
                .build();

        userService.userJoin(req);

        assertEquals(userRepository.findByUserAccount("test1234").get().getUserAccount(), req.getUserAccount());
    }

}
