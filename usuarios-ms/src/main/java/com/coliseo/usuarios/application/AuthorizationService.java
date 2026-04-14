package com.coliseo.usuarios.application;

import com.coliseo.usuarios.application.port.IUserRepository;
import com.coliseo.usuarios.domain.Usuario;
import org.springframework.stereotype.Service;


@Service
public class AuthorizationService {

    private final IUserRepository userRepository;

    public AuthorizationService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean hasPermission(String username, String codigoPermiso) {
        return userRepository.findByUsername(username)
                .map(u -> u.tienePermiso(codigoPermiso))
                .orElse(false);
    }
}
