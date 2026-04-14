package com.coliseo.eventos.infrastructure.persistence;

import com.coliseo.eventos.domain.EstadoEvento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EventoJpaRepository extends JpaRepository<EventoJpaEntity, UUID> {
    Optional<EventoJpaEntity> findByEstado(EstadoEvento estado);
}
