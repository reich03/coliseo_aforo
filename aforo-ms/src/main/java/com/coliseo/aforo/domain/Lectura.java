package com.coliseo.aforo.domain;

import java.time.LocalDateTime;
import java.util.UUID;


public class Lectura {

    private UUID id;
    private UUID aforoId;
    private TipoLectura tipo;
    private LocalDateTime timestamp;

    public Lectura() {}

    public Lectura(UUID aforoId, TipoLectura tipo) {
        this.id = UUID.randomUUID();
        this.aforoId = aforoId;
        this.tipo = tipo;
        this.timestamp = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAforoId() { return aforoId; }
    public void setAforoId(UUID aforoId) { this.aforoId = aforoId; }

    public TipoLectura getTipo() { return tipo; }
    public void setTipo(TipoLectura tipo) { this.tipo = tipo; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
