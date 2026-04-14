package com.coliseo.aforo.application.port;

import com.coliseo.aforo.domain.Aforo;
import com.coliseo.aforo.domain.Lectura;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface IAforoRepository {
    Aforo save(Aforo aforo);
    Optional<Aforo> findByEventoId(UUID eventoId);
    Optional<Aforo> findById(UUID id);
    List<Aforo> findAll();

    Lectura saveLectura(Lectura lectura);
    List<Lectura> findLecturasByAforoId(UUID aforoId);
}
