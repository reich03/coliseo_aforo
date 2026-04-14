package com.coliseo.eventos.infrastructure.persistence;

import com.coliseo.eventos.application.port.IEventoRepository;
import com.coliseo.eventos.domain.EstadoEvento;
import com.coliseo.eventos.domain.Evento;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class EventoRepositoryAdapter implements IEventoRepository {

    private final EventoJpaRepository jpaRepository;

    public EventoRepositoryAdapter(EventoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Evento save(Evento evento) {
        return toDomain(jpaRepository.save(toEntity(evento)));
    }

    @Override
    public Optional<Evento> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Evento> findActivo() {
        return jpaRepository.findByEstado(EstadoEvento.ACTIVO).map(this::toDomain);
    }

    @Override
    public List<Evento> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
    private EventoJpaEntity toEntity(Evento e) {
        EventoJpaEntity entity = new EventoJpaEntity();
        entity.setId(e.getId());
        entity.setNombre(e.getNombre());
        entity.setAforoMaximo(e.getAforoMaximo());
        entity.setEstado(e.getEstado() != null ? e.getEstado() : EstadoEvento.PROGRAMADO);
        entity.setFechaInicio(e.getFechaInicio());
        entity.setFechaFin(e.getFechaFin());
        return entity;
    }

    private Evento toDomain(EventoJpaEntity entity) {
        Evento e = new Evento();
        e.setId(entity.getId());
        e.setNombre(entity.getNombre());
        e.setAforoMaximo(entity.getAforoMaximo());
        e.setEstado(entity.getEstado());
        e.setFechaInicio(entity.getFechaInicio());
        e.setFechaFin(entity.getFechaFin());
        return e;
    }
}
