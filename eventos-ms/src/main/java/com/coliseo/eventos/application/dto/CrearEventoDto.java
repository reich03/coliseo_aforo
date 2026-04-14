package com.coliseo.eventos.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CrearEventoDto {

    @NotBlank(message = "El nombre del evento es obligatorio")
    private String nombre;

    @Min(value = 1, message = "El aforo máximo debe ser mayor a 0")
    private int aforoMaximo;

    public CrearEventoDto() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public int getAforoMaximo() { return aforoMaximo; }
    public void setAforoMaximo(int aforoMaximo) { this.aforoMaximo = aforoMaximo; }
}
