package com.coliseo.aforo.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AforoJpaRepository extends JpaRepository<AforoJpaEntity, UUID> {
    Optional<AforoJpaEntity> findByEventoId(UUID eventoId);
}
