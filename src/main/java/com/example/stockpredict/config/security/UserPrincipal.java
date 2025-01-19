package com.example.stockpredict.config.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

public class UserPrincipal extends User {

    private final String userAccount;

    public UserPrincipal(com.example.stockpredict.domain.user.User user) {
        super(user.getUserAccount(), user.getUserPassword().getPassword(),
                List.of(
                        new SimpleGrantedAuthority("ROLE_USER")
                ));
        this.userAccount = user.getUserAccount();
    }

    public String getUserAccount() {
        return userAccount;
    }
}
