package com.example.stockpredict.exception;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public abstract class ExceptionInterface extends RuntimeException{

    public final Map<String, String> validation = new HashMap<>();

    public abstract int getStatusCode();

    public void addValidation(String fieldName, String message) {
        validation.put(fieldName, message);
    }

    public ExceptionInterface(String message) {
        super(message);
    }

    public ExceptionInterface(String message, Throwable cause) {
        super(message, cause);
    }
}
