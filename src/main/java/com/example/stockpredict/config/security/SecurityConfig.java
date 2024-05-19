package com.example.stockpredict.config.security;

import com.example.stockpredict.config.security.handler.LoginFailHandler;
import com.example.stockpredict.config.security.handler.LoginSuccessHandler;
import com.example.stockpredict.config.security.handler.LogoutSuccessHandler;
import com.example.stockpredict.domain.user.User;
import com.example.stockpredict.repository.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.*;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final ObjectMapper objectMapper;

    private final UserRepository userRepository;


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests((auth)->auth
                .requestMatchers(toH2Console()).permitAll()
                .requestMatchers("/", "/user/join").permitAll()
                .anyRequest().permitAll());

        http.logout(
                httpSecurityLogoutConfigurer -> httpSecurityLogoutConfigurer
                        .logoutRequestMatcher(new AntPathRequestMatcher("/auth/logout"))
                        .logoutSuccessHandler(new LogoutSuccessHandler(objectMapper))
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
        );

        http
                .csrf(AbstractHttpConfigurer::disable);

        http.headers(HeadersConfigurer<HttpSecurity>::disable);


        return http.build();
    }

    @Bean
    public AddressPasswordAuthenticateFilter addressPasswordAuthenticateFilter(){
        AddressPasswordAuthenticateFilter filter = new AddressPasswordAuthenticateFilter("/auth/login", objectMapper);
        filter.setAuthenticationManager(authenticationManager());
        filter.setAuthenticationSuccessHandler(new LoginSuccessHandler(objectMapper));
        filter.setAuthenticationFailureHandler(new LoginFailHandler(objectMapper));
        filter.setSecurityContextRepository(new HttpSessionSecurityContextRepository());

        return filter;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService(userRepository));
        provider.setPasswordEncoder(bCryptPasswordEncoder());
        return new ProviderManager(provider);
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return userAccount -> {
            User user = userRepository.findByUserAccount(userAccount)
                    .orElseThrow(() -> new UsernameNotFoundException(userAccount + "을 찾을 수 없습니다."));
            return new UserPrincipal(user);

        };
    }




}
