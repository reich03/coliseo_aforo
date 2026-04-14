package com.coliseo.aforo.infrastructure.persistence;

import com.coliseo.aforo.domain.TipoLectura;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lecturas")
public class LecturaJpaEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "aforo_id", nullable = false)
    private UUID aforoId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoLectura tipo;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAforoId() { return aforoId; }
    public void setAforoId(UUID aforoId) { this.aforoId = aforoId; }

    public TipoLectura getTipo() { return tipo; }
    public void setTipo(TipoLectura tipo) { this.tipo = tipo; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
