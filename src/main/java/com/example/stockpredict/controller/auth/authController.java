package com.example.stockpredict.controller.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class authController {

    /* 인증상태 체크 */
    @GetMapping("/auth/status")
    public Map<String, Object> authStatus() {
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String);
        response.put("authenticated", isAuthenticated);
        return response;
    }

}
