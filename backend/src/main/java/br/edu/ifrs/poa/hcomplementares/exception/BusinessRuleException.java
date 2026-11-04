package br.edu.ifrs.poa.hcomplementares.exception;

import org.springframework.http.HttpStatus;

public class BusinessRuleException extends ApplicationException {
    public BusinessRuleException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
