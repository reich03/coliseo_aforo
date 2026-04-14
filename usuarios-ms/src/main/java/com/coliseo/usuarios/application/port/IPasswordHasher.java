package com.coliseo.usuarios.application.port;

public interface IPasswordHasher {
    String hash(String rawPassword);
    boolean matches(String rawPassword, String hashedPassword);
}
