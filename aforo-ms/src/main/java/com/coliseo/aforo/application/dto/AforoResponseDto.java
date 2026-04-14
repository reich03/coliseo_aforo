package com.coliseo.aforo.application.dto;

import com.coliseo.aforo.domain.EstadoAforo;

import java.util.UUID;

public class AforoResponseDto {

    private UUID id;
    private UUID eventoId;
    private String eventoNombre;
    private int personasAdentro;
    private int aforoMaximo;
    private float porcentaje;
    private EstadoAforo estado;

    public AforoResponseDto() {
    }

    public AforoResponseDto(UUID id, UUID eventoId, String eventoNombre,
            int personasAdentro, int aforoMaximo,
            float porcentaje, EstadoAforo estado) {
        this.id = id;
        this.eventoId = eventoId;
        this.eventoNombre = eventoNombre;
        this.personasAdentro = personasAdentro;
        this.aforoMaximo = aforoMaximo;
        this.porcentaje = porcentaje;
        this.estado = estado;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getEventoId() {
        return eventoId;
    }

    public void setEventoId(UUID eventoId) {
        this.eventoId = eventoId;
    }

    public String getEventoNombre() {
        return eventoNombre;
    }

    public void setEventoNombre(String eventoNombre) {
        this.eventoNombre = eventoNombre;
    }

    public int getPersonasAdentro() {
        return personasAdentro;
    }

    public void setPersonasAdentro(int personasAdentro) {
        this.personasAdentro = personasAdentro;
    }

    public int getAforoMaximo() {
        return aforoMaximo;
    }

    public void setAforoMaximo(int aforoMaximo) {
        this.aforoMaximo = aforoMaximo;
    }

    public float getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(float porcentaje) {
        this.porcentaje = porcentaje;
    }

    public EstadoAforo getEstado() {
        return estado;
    }

    public void setEstado(EstadoAforo estado) {
        this.estado = estado;
    }
}
