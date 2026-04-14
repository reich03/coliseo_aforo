package com.coliseo.usuarios.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Credencial {
    private UUID id;
    private UUID usuarioId;
    private String passwordHash;
    private String salt;
    private LocalDateTime lastChangedAt;

    public Credencial() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getSalt() { return salt; }
    public void setSalt(String salt) { this.salt = salt; }

    public LocalDateTime getLastChangedAt() { return lastChangedAt; }
    public void setLastChangedAt(LocalDateTime t) { this.lastChangedAt = t; }
}
