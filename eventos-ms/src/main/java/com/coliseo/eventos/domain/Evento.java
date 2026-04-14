package com.coliseo.eventos.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Evento {

    private UUID id;
    private String nombre;
    private int aforoMaximo;
    private EstadoEvento estado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    public Evento() {}

    public Evento(String nombre, int aforoMaximo) {
        this.id = UUID.randomUUID();
        this.nombre = nombre;
        this.aforoMaximo = aforoMaximo;
        this.estado = EstadoEvento.PROGRAMADO;
    }


    public void activar() {
        this.estado = EstadoEvento.ACTIVO;
        this.fechaInicio = LocalDateTime.now();
    }

    public void cerrar() {
        this.estado = EstadoEvento.CERRADO;
        this.fechaFin = LocalDateTime.now();
    }

    public boolean isActivo() {
        return this.estado == EstadoEvento.ACTIVO;
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
