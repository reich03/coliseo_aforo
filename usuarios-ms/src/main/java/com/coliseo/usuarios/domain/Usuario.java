package com.coliseo.usuarios.domain;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class Usuario {
    private UUID id;
    private String username;
    private String email;
    private boolean active;
    private Set<Rol> roles = new HashSet<>();

    public Usuario() {}

    public Usuario(String username, String email) {
        this.id = UUID.randomUUID();
        this.username = username;
        this.email = email;
        this.active = true;
    }

    public boolean tienePermiso(String codigoPermiso) {
        return roles.stream().anyMatch(r -> r.tienePermiso(codigoPermiso));
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Set<Rol> getRoles() { return roles; }
    public void setRoles(Set<Rol> roles) { this.roles = roles; }
}
