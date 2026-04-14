package com.coliseo.reportes.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RegistroJpaRepository extends JpaRepository<RegistroJpaEntity, UUID> {
    List<RegistroJpaEntity> findByEventoIdOrderByTimestampAsc(UUID eventoId);
}
