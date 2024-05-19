package com.example.stockpredict.exception.file;


import com.example.stockpredict.exception.ExceptionInterface;

public class FileNotFoundException extends ExceptionInterface {

    private static final String MESSAGE = "File Not Found";

    public FileNotFoundException() {
        super(MESSAGE);
    }

    @Override
    public int getStatusCode() {
        return 404;
    }
}
