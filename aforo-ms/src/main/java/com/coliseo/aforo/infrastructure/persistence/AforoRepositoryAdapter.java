package com.coliseo.aforo.infrastructure.persistence;

import com.coliseo.aforo.application.port.IAforoRepository;
import com.coliseo.aforo.domain.Aforo;
import com.coliseo.aforo.domain.EstadoAforo;
import com.coliseo.aforo.domain.Lectura;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Component
public class AforoRepositoryAdapter implements IAforoRepository {

    private final AforoJpaRepository aforoJpaRepository;
    private final LecturaJpaRepository lecturaJpaRepository;

    public AforoRepositoryAdapter(AforoJpaRepository aforoJpaRepository,
                                   LecturaJpaRepository lecturaJpaRepository) {
        this.aforoJpaRepository = aforoJpaRepository;
        this.lecturaJpaRepository = lecturaJpaRepository;
    }

    @Override
    public Aforo save(Aforo aforo) {
        AforoJpaEntity entity = toEntity(aforo);
        AforoJpaEntity saved = aforoJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Aforo> findByEventoId(UUID eventoId) {
        return aforoJpaRepository.findByEventoId(eventoId).map(this::toDomain);
    }

    @Override
    public Optional<Aforo> findById(UUID id) {
        return aforoJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Aforo> findAll() {
        return aforoJpaRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Lectura saveLectura(Lectura lectura) {
        LecturaJpaEntity entity = toEntity(lectura);
        LecturaJpaEntity saved = lecturaJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public List<Lectura> findLecturasByAforoId(UUID aforoId) {
        return lecturaJpaRepository.findByAforoIdOrderByTimestampAsc(aforoId)
                .stream().map(this::toDomain).collect(Collectors.toList());
    }

    private AforoJpaEntity toEntity(Aforo a) {
        AforoJpaEntity e = new AforoJpaEntity();
        e.setId(a.getId());
        e.setEventoId(a.getEventoId());
        e.setPersonasAdentro(a.getPersonasAdentro());
        e.setAforoMaximo(a.getAforoMaximo());
        e.setEstado(a.getEstado() != null ? a.getEstado() : EstadoAforo.LIBRE);
        return e;
    }

    private Aforo toDomain(AforoJpaEntity e) {
        Aforo a = new Aforo();
        a.setId(e.getId());
        a.setEventoId(e.getEventoId());
        a.setPersonasAdentro(e.getPersonasAdentro());
        a.setAforoMaximo(e.getAforoMaximo());
        a.setEstado(e.getEstado());
        return a;
    }

    private LecturaJpaEntity toEntity(Lectura l) {
        LecturaJpaEntity e = new LecturaJpaEntity();
        e.setId(l.getId());
        e.setAforoId(l.getAforoId());
        e.setTipo(l.getTipo());
        e.setTimestamp(l.getTimestamp());
        return e;
    }

    private Lectura toDomain(LecturaJpaEntity e) {
        Lectura l = new Lectura();
        l.setId(e.getId());
        l.setAforoId(e.getAforoId());
        l.setTipo(e.getTipo());
        l.setTimestamp(e.getTimestamp());
        return l;
    }
}
