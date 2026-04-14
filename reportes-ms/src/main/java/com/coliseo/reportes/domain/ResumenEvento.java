package com.coliseo.reportes.domain;

import java.time.LocalDateTime;
import java.util.UUID;


public class ResumenEvento {

    private UUID eventoId;
    private String eventoNombre;
    private int totalRegistros;
    private int picoMaximo;
    private float porcentajePico;
    private LocalDateTime horaPico;

    public ResumenEvento() {}

    public UUID getEventoId() { return eventoId; }
    public void setEventoId(UUID eventoId) { this.eventoId = eventoId; }

    public String getEventoNombre() { return eventoNombre; }
    public void setEventoNombre(String eventoNombre) { this.eventoNombre = eventoNombre; }

    public int getTotalRegistros() { return totalRegistros; }
    public void setTotalRegistros(int totalRegistros) { this.totalRegistros = totalRegistros; }

    public int getPicoMaximo() { return picoMaximo; }
    public void setPicoMaximo(int picoMaximo) { this.picoMaximo = picoMaximo; }

    public float getPorcentajePico() { return porcentajePico; }
    public void setPorcentajePico(float porcentajePico) { this.porcentajePico = porcentajePico; }

    public LocalDateTime getHoraPico() { return horaPico; }
    public void setHoraPico(LocalDateTime horaPico) { this.horaPico = horaPico; }
}
