package com.coliseo.usuarios.application.port;

import com.coliseo.usuarios.domain.Usuario;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUserRepository {
    Usuario save(Usuario usuario);
    Optional<Usuario> findById(UUID id);
    Optional<Usuario> findByUsername(String username);
    List<Usuario> findAll();
}
