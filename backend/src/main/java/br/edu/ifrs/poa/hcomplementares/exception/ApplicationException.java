package br.edu.ifrs.poa.hcomplementares.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public abstract class ApplicationException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus httpStatus;

    protected ApplicationException(String message, String errorCode, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
}
