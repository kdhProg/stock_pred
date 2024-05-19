package com.example.stockpredict.service.user;

import com.example.stockpredict.repository.user.UserRepository;
import com.example.stockpredict.request.user.UserJoinRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void clean(){
        userRepository.deleteAll();
    }


    @Test
    @DisplayName("최소정보 회원가입 테스트")
    void userMinInfoJoinTest(){
        UserJoinRequest req = UserJoinRequest.builder()
                .userAccount("test1234")
                .password("qwer1234")
                .build();

        userService.userJoin(req);

        assertEquals(userRepository.findAll().size(), 1);
    }




}