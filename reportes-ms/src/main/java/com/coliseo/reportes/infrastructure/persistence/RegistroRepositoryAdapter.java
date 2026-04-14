package com.coliseo.reportes.infrastructure.persistence;

import com.coliseo.reportes.application.port.IRegistroRepository;
import com.coliseo.reportes.domain.RegistroHistorico;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class RegistroRepositoryAdapter implements IRegistroRepository {

    private final RegistroJpaRepository jpaRepository;

    public RegistroRepositoryAdapter(RegistroJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public RegistroHistorico save(RegistroHistorico r) {
        return toDomain(jpaRepository.save(toEntity(r)));
    }

    @Override
    public List<RegistroHistorico> findByEventoId(UUID eventoId) {
        return jpaRepository.findByEventoIdOrderByTimestampAsc(eventoId)
                .stream().map(this::toDomain).collect(Collectors.toList());
    }

    private RegistroJpaEntity toEntity(RegistroHistorico r) {
        RegistroJpaEntity e = new RegistroJpaEntity();
        e.setId(r.getId());
        e.setEventoId(r.getEventoId());
        e.setPersonasAdentro(r.getPersonasAdentro());
        e.setAforoMaximo(r.getAforoMaximo());
        e.setPorcentaje(r.getPorcentaje());
        e.setTimestamp(r.getTimestamp());
        return e;
    }

    private RegistroHistorico toDomain(RegistroJpaEntity e) {
        RegistroHistorico r = new RegistroHistorico();
        r.setId(e.getId());
        r.setEventoId(e.getEventoId());
        r.setPersonasAdentro(e.getPersonasAdentro());
        r.setAforoMaximo(e.getAforoMaximo());
        r.setPorcentaje(e.getPorcentaje());
        r.setTimestamp(e.getTimestamp());
        return r;
    }
}
