package com.coliseo.usuarios.domain;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class Rol {
    private UUID id;
    private String nombre;
    private Set<Permiso> permisos = new HashSet<>();

    public Rol() {}

    public Rol(UUID id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public boolean tienePermiso(String codigoPermiso) {
        return permisos.stream().anyMatch(p -> p.getCodigo().equals(codigoPermiso));
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Set<Permiso> getPermisos() { return permisos; }
    public void setPermisos(Set<Permiso> permisos) { this.permisos = permisos; }
}
