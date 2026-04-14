package com.coliseo.aforo.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LecturaJpaRepository extends JpaRepository<LecturaJpaEntity, UUID> {
    List<LecturaJpaEntity> findByAforoIdOrderByTimestampAsc(UUID aforoId);
}
