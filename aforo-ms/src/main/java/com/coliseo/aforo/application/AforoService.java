package com.coliseo.aforo.application;

import com.coliseo.aforo.application.dto.AforoResponseDto;
import com.coliseo.aforo.application.dto.LecturaRequestDto;
import com.coliseo.aforo.application.port.IAforoRepository;
import com.coliseo.aforo.domain.Aforo;
import com.coliseo.aforo.domain.Lectura;
import com.coliseo.aforo.domain.TipoLectura;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;


@Service
@Transactional
public class AforoService {

    private final IAforoRepository aforoRepository;
    private final AlertaService alertaService;
    private final RestTemplate restTemplate;

    @Value("${eventos.ms.url:http://localhost:8082}")
    private String eventosMsUrl;

    public AforoService(IAforoRepository aforoRepository,
                        AlertaService alertaService,
                        RestTemplate restTemplate) {
        this.aforoRepository = aforoRepository;
        this.alertaService = alertaService;
        this.restTemplate = restTemplate;
    }

    private UUID obtenerEventoActivoId() {
        try {
            Map<?, ?> evento = restTemplate.getForObject(eventosMsUrl + "/eventos/activo", Map.class);
            if (evento != null && evento.get("id") != null) {
                return UUID.fromString(evento.get("id").toString());
            }
        } catch (Exception e) {
            System.out.println("[AforoService] No se pudo obtener evento activo: " + e.getMessage());
        }
        return UUID.fromString("00000000-0000-0000-0000-000000000001");
    }

    private int obtenerAforoMaximoEvento() {
        try {
            Map<?, ?> evento = restTemplate.getForObject(eventosMsUrl + "/eventos/activo", Map.class);
            if (evento != null && evento.get("aforoMaximo") != null) {
                return Integer.parseInt(evento.get("aforoMaximo").toString());
            }
        } catch (Exception e) {
            // silencioso
        }
        return 1000;
    }

    
    public AforoResponseDto registrarLectura(LecturaRequestDto dto) {
        UUID eventoId = dto.getEventoId() != null ? dto.getEventoId() : obtenerEventoActivoId();

        Aforo aforo = aforoRepository.findByEventoId(eventoId)
                .orElseGet(() -> {
                    int capacidad = (dto.getAforoMaximo() != null && dto.getAforoMaximo() > 0)
                            ? dto.getAforoMaximo() : obtenerAforoMaximoEvento();
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
