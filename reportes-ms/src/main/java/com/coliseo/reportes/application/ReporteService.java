package com.coliseo.reportes.application;

import com.coliseo.reportes.application.port.IRegistroRepository;
import com.coliseo.reportes.domain.RegistroHistorico;
import com.coliseo.reportes.domain.ResumenEvento;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReporteService {

    private final IRegistroRepository registroRepository;

    public ReporteService(IRegistroRepository registroRepository) {
        this.registroRepository = registroRepository;
    }

    public RegistroHistorico guardarRegistro(UUID eventoId, int personasAdentro, int aforoMaximo) {
        RegistroHistorico registro = new RegistroHistorico(eventoId, personasAdentro, aforoMaximo);
        return registroRepository.save(registro);
    }

    @Transactional(readOnly = true)
    public ResumenEvento calcularResumen(UUID eventoId) {
        List<RegistroHistorico> registros = registroRepository.findByEventoId(eventoId);

        ResumenEvento resumen = new ResumenEvento();
        resumen.setEventoId(eventoId);
        resumen.setTotalRegistros(registros.size());

        registros.stream()
                .max(Comparator.comparingInt(RegistroHistorico::getPersonasAdentro))
                .ifPresent(r -> {
                    resumen.setPicoMaximo(r.getPersonasAdentro());
                    resumen.setPorcentajePico(r.getPorcentaje());
                    resumen.setHoraPico(r.getTimestamp());
                });

        return resumen;
    }

    @Transactional(readOnly = true)
    public List<RegistroHistorico> obtenerHistorial(UUID eventoId) {
        return registroRepository.findByEventoId(eventoId);
    }
}
