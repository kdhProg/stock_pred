package com.example.stockpredict.exception.post;

import com.example.stockpredict.exception.ExceptionInterface;

public class PostNotFoundException extends ExceptionInterface {

    private static final String MESSAGE = "글을 찾을 수 없습니다.";

    public PostNotFoundException() {
        super(MESSAGE);
    }

    @Override
    public int getStatusCode() {
        return 404;
    }

}
