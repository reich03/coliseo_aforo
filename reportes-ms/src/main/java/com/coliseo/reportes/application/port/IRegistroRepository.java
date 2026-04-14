package com.coliseo.reportes.application.port;

import com.coliseo.reportes.domain.RegistroHistorico;

import java.util.List;
import java.util.UUID;

public interface IRegistroRepository {
    RegistroHistorico save(RegistroHistorico registro);
    List<RegistroHistorico> findByEventoId(UUID eventoId);
}
