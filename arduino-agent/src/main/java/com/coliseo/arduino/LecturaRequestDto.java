package com.coliseo.arduino;

/**
 * GRASP Pure Fabrication: LecturaRequestDto existe únicamente como
 * facilitador de comunicación entre el Arduino Agent y el Backend.
 * No representa ninguna entidad del dominio del coliseo.
 */
public class LecturaRequestDto {

    private String tipo;         // "ENTRADA" o "SALIDA"
    private Integer contadorArduino;

    public LecturaRequestDto() {}

    public LecturaRequestDto(String tipo, Integer contadorArduino) {
        this.tipo = tipo;
        this.contadorArduino = contadorArduino;
    }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Integer getContadorArduino() { return contadorArduino; }
    public void setContadorArduino(Integer contadorArduino) { this.contadorArduino = contadorArduino; }
}
