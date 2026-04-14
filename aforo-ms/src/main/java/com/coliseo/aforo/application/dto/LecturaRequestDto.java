package com.coliseo.aforo.application.dto;

import com.coliseo.aforo.domain.TipoLectura;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class LecturaRequestDto {

    @NotNull(message = "El tipo de lectura es obligatorio")
    private TipoLectura tipo;

    private UUID eventoId;

    private Integer aforoMaximo;

    private Integer contadorArduino;

    public LecturaRequestDto() {}

    public TipoLectura getTipo() { return tipo; }
    public void setTipo(TipoLectura tipo) { this.tipo = tipo; }

    public UUID getEventoId() { return eventoId; }
    public void setEventoId(UUID eventoId) { this.eventoId = eventoId; }

    public Integer getAforoMaximo() { return aforoMaximo; }
    public void setAforoMaximo(Integer aforoMaximo) { this.aforoMaximo = aforoMaximo; }

    public Integer getContadorArduino() { return contadorArduino; }
    public void setContadorArduino(Integer contadorArduino) { this.contadorArduino = contadorArduino; }
}
