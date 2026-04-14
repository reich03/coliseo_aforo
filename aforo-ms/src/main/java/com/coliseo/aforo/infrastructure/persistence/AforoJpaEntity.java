package com.coliseo.aforo.infrastructure.persistence;

import com.coliseo.aforo.domain.EstadoAforo;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "aforos")
public class AforoJpaEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "evento_id", nullable = false)
    private UUID eventoId;

    @Column(name = "personas_adentro", nullable = false)
    private int personasAdentro;

    @Column(name = "aforo_maximo", nullable = false)
    private int aforoMaximo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAforo estado;

    @Column(name = "actualizado_at")
    private LocalDateTime actualizadoAt;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.actualizadoAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getEventoId() { return eventoId; }
    public void setEventoId(UUID eventoId) { this.eventoId = eventoId; }

    public int getPersonasAdentro() { return personasAdentro; }
    public void setPersonasAdentro(int personasAdentro) { this.personasAdentro = personasAdentro; }

    public int getAforoMaximo() { return aforoMaximo; }
    public void setAforoMaximo(int aforoMaximo) { this.aforoMaximo = aforoMaximo; }

    public EstadoAforo getEstado() { return estado; }
    public void setEstado(EstadoAforo estado) { this.estado = estado; }

    public LocalDateTime getActualizadoAt() { return actualizadoAt; }
    public void setActualizadoAt(LocalDateTime actualizadoAt) { this.actualizadoAt = actualizadoAt; }
}
