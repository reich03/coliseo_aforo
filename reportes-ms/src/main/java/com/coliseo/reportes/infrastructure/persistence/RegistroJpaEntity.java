package com.coliseo.reportes.infrastructure.persistence;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "registros_historicos")
public class RegistroJpaEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "evento_id", nullable = false)
    private UUID eventoId;

    @Column(name = "personas_adentro", nullable = false)
    private int personasAdentro;

    @Column(name = "aforo_maximo", nullable = false)
    private int aforoMaximo;

    @Column(nullable = false)
    private float porcentaje;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getEventoId() { return eventoId; }
    public void setEventoId(UUID eventoId) { this.eventoId = eventoId; }

    public int getPersonasAdentro() { return personasAdentro; }
    public void setPersonasAdentro(int p) { this.personasAdentro = p; }

    public int getAforoMaximo() { return aforoMaximo; }
    public void setAforoMaximo(int a) { this.aforoMaximo = a; }

    public float getPorcentaje() { return porcentaje; }
    public void setPorcentaje(float p) { this.porcentaje = p; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime ts) { this.timestamp = ts; }
}
