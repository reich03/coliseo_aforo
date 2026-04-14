package com.coliseo.aforo.domain;

import java.time.LocalDateTime;
import java.util.UUID;


public class Alerta {

    private UUID id;
    private UUID aforoId;
    private String tipo;      
    private String mensaje;
    private LocalDateTime timestamp;

    public Alerta() {}

    public Alerta(UUID aforoId, String tipo, String mensaje) {
        this.id = UUID.randomUUID();
        this.aforoId = aforoId;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.timestamp = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAforoId() { return aforoId; }
    public void setAforoId(UUID aforoId) { this.aforoId = aforoId; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
