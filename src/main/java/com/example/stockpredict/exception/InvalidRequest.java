package com.example.stockpredict.exception;

import lombok.Getter;

@Getter
public class InvalidRequest extends ExceptionInterface{

    private static final String MESSAGE = "Bad Request";

    public InvalidRequest() {
        super(MESSAGE);
    }

    public InvalidRequest(String fieldName, String message) {
        super(MESSAGE);
        addValidation(fieldName, message);
    }

    @Override
    public int getStatusCode() {
        return 400;
    }
}
