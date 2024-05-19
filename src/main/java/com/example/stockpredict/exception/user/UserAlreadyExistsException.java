package com.example.stockpredict.exception.user;

import com.example.stockpredict.exception.ExceptionInterface;

public class UserAlreadyExistsException extends ExceptionInterface {

    private static final String MESSAGE = "이미 존재하는 회원입니다";

    public UserAlreadyExistsException() {
        super(MESSAGE);
    }

    @Override
    public int getStatusCode() {
        return 400;
    }
}
