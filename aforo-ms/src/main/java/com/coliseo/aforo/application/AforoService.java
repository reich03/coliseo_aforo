package com.coliseo.aforo.application;

import com.coliseo.aforo.application.dto.AforoResponseDto;
import com.coliseo.aforo.application.dto.LecturaRequestDto;
import com.coliseo.aforo.application.port.IAforoRepository;
import com.coliseo.aforo.domain.Aforo;
import com.coliseo.aforo.domain.EstadoAforo;
import com.coliseo.aforo.domain.Lectura;
import com.coliseo.aforo.domain.TipoLectura;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;


@Service
@Transactional
public class AforoService {

    private final IAforoRepository aforoRepository;
    private final AlertaService alertaService;

    public AforoService(IAforoRepository aforoRepository,
                        AlertaService alertaService) {
        this.aforoRepository = aforoRepository;
        this.alertaService = alertaService;
    }

    /**
     * Registra una lectura del sensor (ENTRADA o SALIDA).
     *
     * @param dto datos enviados por el Arduino Agent
     * @return estado actualizado del aforo
     */
    public AforoResponseDto registrarLectura(LecturaRequestDto dto) {
        UUID eventoId = dto.getEventoId() != null ? dto.getEventoId() : UUID.fromString("00000000-0000-0000-0000-000000000001");

        Aforo aforo = aforoRepository.findByEventoId(eventoId)
                .orElseGet(() -> {
                    int capacidad = (dto.getAforoMaximo() != null && dto.getAforoMaximo() > 0)
                            ? dto.getAforoMaximo() : 1000;
                    Aforo nuevo = new Aforo(UUID.randomUUID(), capacidad, eventoId);
                    return aforoRepository.save(nuevo);
                });

        if (dto.getAforoMaximo() != null && dto.getAforoMaximo() > 0
                && dto.getAforoMaximo() != aforo.getAforoMaximo()) {
            aforo.setAforoMaximo(dto.getAforoMaximo());
        }

        Lectura lectura = new Lectura(aforo.getId(), dto.getTipo());
        aforoRepository.saveLectura(lectura);

        if (dto.getTipo() == TipoLectura.ENTRADA) {
            aforo.registrarEntrada();
        } else {
            aforo.registrarSalida();
        }

        aforoRepository.save(aforo);

        AforoResponseDto respuesta = toDto(aforo, "Evento activo");
        alertaService.evaluarYNotificar(aforo, respuesta);

        return respuesta;
    }

    @Transactional(readOnly = true)
    public AforoResponseDto obtenerEstado(UUID eventoId) {
        return aforoRepository.findByEventoId(eventoId)
                .map(a -> toDto(a, "Evento activo"))
                .orElseGet(() -> new AforoResponseDto(
                        eventoId, eventoId, "Sin datos",
                        0, 1000, 0.0f,
                        com.coliseo.aforo.domain.EstadoAforo.LIBRE));
    }

    public AforoResponseDto resetear(UUID eventoId) {
        Aforo aforo = aforoRepository.findByEventoId(eventoId)
                .orElseThrow(() -> new RuntimeException("No existe aforo para el evento: " + eventoId));
        aforo.resetear();
        aforoRepository.save(aforo);
        return toDto(aforo, "Evento activo");
    }

    @Transactional(readOnly = true)
    public List<Lectura> obtenerHistorial(UUID eventoId) {
        return aforoRepository.findByEventoId(eventoId)
                .map(a -> aforoRepository.findLecturasByAforoId(a.getId()))
                .orElse(java.util.Collections.emptyList());
    }

    private AforoResponseDto toDto(Aforo aforo, String eventoNombre) {
        return new AforoResponseDto(
                aforo.getId(),
                aforo.getEventoId(),
                eventoNombre,
                aforo.getPersonasAdentro(),
                aforo.getAforoMaximo(),
                aforo.calcularPorcentaje(),
                aforo.getEstado()
        );
    }
}
