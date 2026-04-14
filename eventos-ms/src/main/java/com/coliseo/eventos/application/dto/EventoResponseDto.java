package com.coliseo.eventos.application.dto;

import com.coliseo.eventos.domain.EstadoEvento;

import java.time.LocalDateTime;
import java.util.UUID;

public class EventoResponseDto {

    private UUID id;
    private String nombre;
    private int aforoMaximo;
    private EstadoEvento estado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    public EventoResponseDto() {}

    public EventoResponseDto(UUID id, String nombre, int aforoMaximo,
                              EstadoEvento estado, LocalDateTime fechaInicio,
                              LocalDateTime fechaFin) {
        this.id = id;
        this.nombre = nombre;
        this.aforoMaximo = aforoMaximo;
        this.estado = estado;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public int getAforoMaximo() { return aforoMaximo; }
    public void setAforoMaximo(int aforoMaximo) { this.aforoMaximo = aforoMaximo; }

    public EstadoEvento getEstado() { return estado; }
    public void setEstado(EstadoEvento estado) { this.estado = estado; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
}
