package com.example.stockpredict.controller.user;

import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.repository.user.UserRepository;
import com.example.stockpredict.request.user.UserJoinRequest;
import com.example.stockpredict.service.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;


    @Autowired
    private UserRepository userRepository;





    @BeforeEach
    void clean(){
        userRepository.deleteAll();
    }


    @Test
    @DisplayName("/user/join 테스트")
    void userJoinTest() throws Exception {

        UserJoinRequest user = UserJoinRequest.builder()
                .userAccount("test1234")
                .password("qwer1234")
                .build();

        String json = objectMapper.writeValueAsString(user);

        mockMvc.perform(post("/user/join")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andDo(print());
    }


    @Test
    @DisplayName("/auth/login 테스트")
    void authLoginTest() throws Exception {

        UserJoinRequest user = UserJoinRequest.builder()
                .userAccount("test1234")
                .password("qwer1234")
                .build();

        userService.userJoin(user);


        String req = "{\"userAccount\" : \"test1234\", \"password\" : \"qwer1234\"}";

        mockMvc.perform(get("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(req))
                .andExpect(status().isOk())
                .andDo(print());
    }

}