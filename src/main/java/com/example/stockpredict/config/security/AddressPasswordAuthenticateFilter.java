package com.example.stockpredict.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import java.io.IOException;

public class AddressPasswordAuthenticateFilter extends AbstractAuthenticationProcessingFilter {

    private final ObjectMapper objectMapper;

    public AddressPasswordAuthenticateFilter(String loginUrl, ObjectMapper objectMapper) {
        super(loginUrl);
        this.objectMapper = objectMapper;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        AccountPassword addressPassword = objectMapper.readValue(request.getInputStream(), AccountPassword.class);

        UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated(
                addressPassword.userAccount,
                addressPassword.password
        );

        token.setDetails(this.authenticationDetailsSource.buildDetails(request));
        return this.getAuthenticationManager().authenticate(token);
    }

    @Getter
    private static class AccountPassword {
        private String userAccount;
        private String password;
    }

}
