package com.coliseo.arduino;


public class LecturaRequestDto {

    private String tipo;
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
