package com.coliseo.eventos.application;

import com.coliseo.eventos.application.dto.CrearEventoDto;
import com.coliseo.eventos.application.dto.EventoResponseDto;
import com.coliseo.eventos.application.port.IEventoRepository;
import com.coliseo.eventos.domain.Evento;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventoService {

    private final IEventoRepository eventoRepository;

    public EventoService(IEventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public EventoResponseDto crearEvento(CrearEventoDto dto) {
        Evento evento = new Evento(dto.getNombre(), dto.getAforoMaximo());
        return toDto(eventoRepository.save(evento));
    }

    @Transactional(readOnly = true)
    public List<EventoResponseDto> listarEventos() {
        return eventoRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventoResponseDto obtenerActivo() {
        Evento evento = eventoRepository.findActivo()
                .orElseThrow(() -> new RuntimeException("No hay ningún evento activo"));
        return toDto(evento);
    }

    public EventoResponseDto activarEvento(UUID id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado: " + id));
        evento.activar();
        return toDto(eventoRepository.save(evento));
    }

    public EventoResponseDto cerrarEvento(UUID id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado: " + id));
        evento.cerrar();
        return toDto(eventoRepository.save(evento));
    }

    public void eliminarEvento(UUID id) {
        eventoRepository.deleteById(id);
    }


    private EventoResponseDto toDto(Evento e) {
        return new EventoResponseDto(
                e.getId(), e.getNombre(), e.getAforoMaximo(),
                e.getEstado(), e.getFechaInicio(), e.getFechaFin());
    }
}
