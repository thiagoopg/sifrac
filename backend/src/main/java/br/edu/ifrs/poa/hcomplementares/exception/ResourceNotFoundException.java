package br.edu.ifrs.poa.hcomplementares.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApplicationException {
    public ResourceNotFoundException(String resource, Object identifier) {
        super(String.format("%s com identificador '%s' nao encontrado", resource, identifier),
              "RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND);
    }
}
