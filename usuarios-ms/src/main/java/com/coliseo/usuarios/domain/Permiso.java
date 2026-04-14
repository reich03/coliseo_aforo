package com.coliseo.usuarios.domain;

import java.util.UUID;

public class Permiso {
    private UUID id;
    private String codigo;

    public Permiso() {}

    public Permiso(UUID id, String codigo) {
        this.id = id;
        this.codigo = codigo;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
}
