package com.example.stockpredict.service.user;

import com.example.stockpredict.config.security.UserPrincipal;
import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.domain.user.UserPassword;
import com.example.stockpredict.domain.user.UserProfile;
import com.example.stockpredict.domain.user.UserSubscription;
import com.example.stockpredict.exception.user.UserAlreadyExistsException;
import com.example.stockpredict.repository.user.UserPasswordRepository;
import com.example.stockpredict.repository.user.UserProfileRepository;
import com.example.stockpredict.repository.user.UserRepository;
import com.example.stockpredict.repository.user.UserSubscriptionRepository;
import com.example.stockpredict.request.user.UserJoinRequest;
import com.example.stockpredict.request.user.UserUpdateRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserPasswordRepository userPasswordRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;

    private final PasswordEncoder passwordEncoder;

    /* 회원가입 */
    public void userJoin(UserJoinRequest userJoinRequest) {
        Optional<User> userExist = userRepository.findByUserAccount(userJoinRequest.getUserAccount());
        if(userExist.isPresent()) {
            throw new UserAlreadyExistsException();
        }

        String encodedPassword = passwordEncoder.encode(userJoinRequest.getPassword());

        User user = User.builder()
                .userAccount(userJoinRequest.getUserAccount())
                .build();

        UserPassword userPassword = UserPassword.builder()
                .user(user)
                .password(encodedPassword)
                .updateDate(LocalDateTime.now())
                .build();

        UserProfile userProfile = UserProfile.builder()
                .user(user)
                .address(userJoinRequest.getAddress())
                .phone(userJoinRequest.getPhone())
                .gender(userJoinRequest.getGender())
                .nickName(userJoinRequest.getNickName())
//                .profileImage(userJoinRequest.getProfileImage())
                .birth(userJoinRequest.getBirth())
                .nation(userJoinRequest.getNation())
                .createdAt(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .build();

        UserSubscription userSubscription = UserSubscription.builder()
                .user(user)
                .subscriptionPlan(0)
                .build();

        userRepository.save(user);
        userPasswordRepository.save(userPassword);
        userProfileRepository.save(userProfile);
        userSubscriptionRepository.save(userSubscription);
    }

    /* 현재 로그인 사용자 구독여부  무료:0  유료:1 */
    public Integer getCurrentUserPlan(UserPrincipal userPrincipal) {
        User user = userRepository.findByUserAccount(userPrincipal.getUserAccount()).orElseThrow(()->new UsernameNotFoundException("User not found"));
        return user.getUserSubscription().getSubscriptionPlan();
    }

    /* 아이디 중복 여부 반환   이미 있다면 true */
    public Boolean chkIdDuplicate(String id) {
        return userRepository.findByUserAccount(id).isPresent();
    }

    /* 유저정보 수정 */
    @Transactional
    public void updateUser(String currentUser,UserUpdateRequest req) {
        // Todo 에러 해결하기
        User user = userRepository.findByUserAccount(currentUser).get();
        UserProfile profile = user.getUserProfile();

        // 새로운 계정으로 변경
        user.setUserAccount(req.getUserAccount());
        profile.edit(req);
    }


}
