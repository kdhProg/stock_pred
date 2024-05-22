package com.example.stockpredict.controller.payment;

import com.example.stockpredict.config.security.UserPrincipal;
import com.example.stockpredict.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    /* 유료회원 전환 */
    @PatchMapping("/changeUserPlan")
    public void changeUserPlan(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        paymentService.changeUserPlan(userPrincipal.getUserAccount());
    }
}
