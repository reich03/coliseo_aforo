package com.coliseo.usuarios.infrastructure.persistence;

import com.coliseo.usuarios.domain.Usuario;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioJpaRepository jpaRepository;

    public DataInitializer(UsuarioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public void run(String... args) {
        if (jpaRepository.findByUsername("admin").isEmpty()) {
            UsuarioJpaEntity admin = new UsuarioJpaEntity();
            admin.setId(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"));
            admin.setUsername("admin");
            admin.setEmail("admin@coliseo.co");
            admin.setActive(true);
            jpaRepository.save(admin);
            System.out.println("[DataInitializer] Usuario creado → admin / admin123");
        }

        if (jpaRepository.findByUsername("operador").isEmpty()) {
            UsuarioJpaEntity op = new UsuarioJpaEntity();
            op.setId(java.util.UUID.randomUUID());
            op.setUsername("operador");
            op.setEmail("operador@coliseo.co");
            op.setActive(true);
            jpaRepository.save(op);
            System.out.println("[DataInitializer] Usuario creado → operador / operador123");
        }
    }
}
