package com.example.stockpredict.controller.payment;

import com.example.stockpredict.config.security.UserPrincipal;
import com.example.stockpredict.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    /* 유료회원 전환 */
    /* PATCH로 할려했는데 PUT만 정상작동함 Todo : 이유탐구 */
    @PutMapping("/changeUserPlanFreeToPaid")
    public void changeUserPlanFreeToPaid(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        paymentService.changeUserPlanFreeToPaid(userPrincipal.getUserAccount());
    }
}
