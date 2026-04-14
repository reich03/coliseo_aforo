package com.coliseo.usuarios.presentation;

import com.coliseo.usuarios.application.AutenticacionService;
import com.coliseo.usuarios.application.dto.LoginRequestDto;
import com.coliseo.usuarios.application.dto.LoginResponseDto;
import com.coliseo.usuarios.application.dto.RegisterRequestDto;
import com.coliseo.usuarios.application.port.IUserRepository;
import com.coliseo.usuarios.domain.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuarios", description = "Autenticación y gestión de operadores")
public class UsuarioController {

    private final AutenticacionService autenticacionService;
    private final IUserRepository userRepository;

    public UsuarioController(AutenticacionService autenticacionService,
                              IUserRepository userRepository) {
        this.autenticacionService = autenticacionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticarse y recibir JWT")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(autenticacionService.login(dto));
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar nuevo operador")
    public ResponseEntity<Usuario> register(@Valid @RequestBody RegisterRequestDto dto) {
        return ResponseEntity.ok(autenticacionService.register(dto));
    }

    @GetMapping
    @Operation(summary = "Listar todos los usuarios")
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}/activar")
    @Operation(summary = "Activar usuario")
    public ResponseEntity<Usuario> activar(@PathVariable UUID id) {
        Usuario usuario = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActive(true);
        return ResponseEntity.ok(userRepository.save(usuario));
    }

    @PutMapping("/{id}/desactivar")
    @Operation(summary = "Desactivar usuario")
    public ResponseEntity<Usuario> desactivar(@PathVariable UUID id) {
        Usuario usuario = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActive(false);
        return ResponseEntity.ok(userRepository.save(usuario));
    }
}
