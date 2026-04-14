package com.coliseo.eventos.application.port;

import com.coliseo.eventos.domain.Evento;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IEventoRepository {
    Evento save(Evento evento);
    Optional<Evento> findById(UUID id);
    Optional<Evento> findActivo();
    List<Evento> findAll();
    void deleteById(UUID id);
}
