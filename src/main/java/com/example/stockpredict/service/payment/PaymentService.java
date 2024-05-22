package com.example.stockpredict.service.payment;

import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.repository.user.UserRepository;
import com.example.stockpredict.service.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserRepository userRepository;

    /* 유료회원 전환 */
    @Transactional
    public void changeUserPlanFreeToPaid(String userAccount) {

        /*
        *
        * 이곳에 결제 API 연동하기
        * - 지금은 임시로 무조건 승인
        *
        * */
        Optional<User> user = userRepository.findByUserAccount(userAccount);
        user.get().getUserSubscription().freeToPaid();
    }
}
