package br.edu.ifrs.poa.hcomplementares.exception;

import org.springframework.http.HttpStatus;

public class ResourceConflictException extends ApplicationException {
    public ResourceConflictException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }
}
