package com.example.stockpredict.exception.python_modules;

import com.example.stockpredict.exception.ExceptionInterface;

public class PythonModuleException extends ExceptionInterface {

    private static final String MESSAGE = "파이썬 모듈 에러";

    public PythonModuleException() {
        super(MESSAGE);
    }

    @Override
    public int getStatusCode() {
        return 500;
    }
}
