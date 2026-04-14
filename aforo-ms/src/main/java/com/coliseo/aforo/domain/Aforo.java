package com.coliseo.aforo.domain;


public class Aforo {

    private java.util.UUID id;
    private int personasAdentro;
    private int aforoMaximo;
    private EstadoAforo estado;
    private java.util.UUID eventoId;

    public Aforo() {}

    public Aforo(java.util.UUID id, int aforoMaximo, java.util.UUID eventoId) {
        this.id = id;
        this.aforoMaximo = aforoMaximo;
        this.eventoId = eventoId;
        this.personasAdentro = 0;
        this.estado = EstadoAforo.LIBRE;
    }

    public void registrarEntrada() {
        if (personasAdentro < aforoMaximo) personasAdentro++;
        this.estado = determinarEstado();
    }

    public void registrarSalida() {
        if (personasAdentro > 0) personasAdentro--;
        this.estado = determinarEstado();
    }

    public float calcularPorcentaje() {
        if (aforoMaximo == 0) return 0;
        return ((float) personasAdentro / aforoMaximo) * 100;
    }

    public EstadoAforo determinarEstado() {
        float pct = calcularPorcentaje();
        if (pct >= 100) return EstadoAforo.LLENO;
        if (pct >= 70)  return EstadoAforo.ALERTA;
        return EstadoAforo.LIBRE;
    }

    public void resetear() {
        this.personasAdentro = 0;
        this.estado = EstadoAforo.LIBRE;
    }

    public java.util.UUID getId() { return id; }
    public void setId(java.util.UUID id) { this.id = id; }

    public int getPersonasAdentro() { return personasAdentro; }
    public void setPersonasAdentro(int personasAdentro) { this.personasAdentro = personasAdentro; }

    public int getAforoMaximo() { return aforoMaximo; }
    public void setAforoMaximo(int aforoMaximo) { this.aforoMaximo = aforoMaximo; }

    public EstadoAforo getEstado() { return estado; }
    public void setEstado(EstadoAforo estado) { this.estado = estado; }

    public java.util.UUID getEventoId() { return eventoId; }
    public void setEventoId(java.util.UUID eventoId) { this.eventoId = eventoId; }
}
