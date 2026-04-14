package com.coliseo.eventos.presentation;

import com.coliseo.eventos.application.EventoService;
import com.coliseo.eventos.application.dto.CrearEventoDto;
import com.coliseo.eventos.application.dto.EventoResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/eventos")
@Tag(name = "Eventos", description = "Gestión de eventos del coliseo")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @PostMapping
    @Operation(summary = "Crear nuevo evento")
    public ResponseEntity<EventoResponseDto> crear(@Valid @RequestBody CrearEventoDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventoService.crearEvento(dto));
    }

    @GetMapping
    @Operation(summary = "Listar todos los eventos")
    public ResponseEntity<List<EventoResponseDto>> listar() {
        return ResponseEntity.ok(eventoService.listarEventos());
    }

    @GetMapping("/activo")
    @Operation(summary = "Obtener evento activo")
    public ResponseEntity<EventoResponseDto> activo() {
        return ResponseEntity.ok(eventoService.obtenerActivo());
    }

    @PutMapping("/{id}/activar")
    @Operation(summary = "Activar evento")
    public ResponseEntity<EventoResponseDto> activar(@PathVariable UUID id) {
        return ResponseEntity.ok(eventoService.activarEvento(id));
    }

    @PutMapping("/{id}/cerrar")
    @Operation(summary = "Cerrar evento")
    public ResponseEntity<EventoResponseDto> cerrar(@PathVariable UUID id) {
        return ResponseEntity.ok(eventoService.cerrarEvento(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar evento")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        eventoService.eliminarEvento(id);
        return ResponseEntity.noContent().build();
    }
}
