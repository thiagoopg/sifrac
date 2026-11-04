package br.edu.ifrs.poa.hcomplementares.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends ApplicationException {
    public ConflictException(String message) {
        super(message, "CONFLICT", HttpStatus.CONFLICT);
    }
}
