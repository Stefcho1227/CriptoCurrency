package org.example.cryptocurrency.exceptions;
public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String entity) {
        super(String.format("%s not found.", entity));
    }
}