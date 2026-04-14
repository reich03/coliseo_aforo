package com.coliseo.usuarios.application;

import com.coliseo.usuarios.application.dto.LoginRequestDto;
import com.coliseo.usuarios.application.dto.LoginResponseDto;
import com.coliseo.usuarios.application.dto.RegisterRequestDto;
import com.coliseo.usuarios.application.port.IPasswordHasher;
import com.coliseo.usuarios.application.port.IUserRepository;
import com.coliseo.usuarios.domain.Usuario;
import com.coliseo.usuarios.infrastructure.security.JwtTokenProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AutenticacionService {

    private final IUserRepository userRepository;
    private final IPasswordHasher passwordHasher;
    private final JwtTokenProvider jwtTokenProvider;

    public AutenticacionService(IUserRepository userRepository,
                                 IPasswordHasher passwordHasher,
                                 JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        Usuario usuario = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.isActive()) {
            throw new RuntimeException("Usuario desactivado");
        }
        String token = jwtTokenProvider.generateToken(usuario.getUsername());
        return new LoginResponseDto(token, usuario.getUsername(), usuario.getEmail());
    }

    public Usuario register(RegisterRequestDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("El username ya existe");
        }
        Usuario usuario = new Usuario(dto.getUsername(), dto.getEmail());
        return userRepository.save(usuario);
    }
}
