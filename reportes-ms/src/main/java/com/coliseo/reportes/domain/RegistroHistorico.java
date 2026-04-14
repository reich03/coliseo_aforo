package com.coliseo.reportes.domain;

import java.time.LocalDateTime;
import java.util.UUID;


public class RegistroHistorico {

    private UUID id;
    private UUID eventoId;
    private int personasAdentro;
    private int aforoMaximo;
    private float porcentaje;
    private LocalDateTime timestamp;

    public RegistroHistorico() {}

    public RegistroHistorico(UUID eventoId, int personasAdentro, int aforoMaximo) {
        this.id = UUID.randomUUID();
        this.eventoId = eventoId;
        this.personasAdentro = personasAdentro;
        this.aforoMaximo = aforoMaximo;
        this.porcentaje = aforoMaximo > 0 ? ((float) personasAdentro / aforoMaximo) * 100 : 0;
        this.timestamp = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getEventoId() { return eventoId; }
    public void setEventoId(UUID eventoId) { this.eventoId = eventoId; }

    public int getPersonasAdentro() { return personasAdentro; }
    public void setPersonasAdentro(int personasAdentro) { this.personasAdentro = personasAdentro; }

    public int getAforoMaximo() { return aforoMaximo; }
    public void setAforoMaximo(int aforoMaximo) { this.aforoMaximo = aforoMaximo; }

    public float getPorcentaje() { return porcentaje; }
    public void setPorcentaje(float porcentaje) { this.porcentaje = porcentaje; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime ts) { this.timestamp = ts; }
}
