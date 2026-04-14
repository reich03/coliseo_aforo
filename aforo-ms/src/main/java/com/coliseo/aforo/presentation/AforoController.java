package com.coliseo.aforo.presentation;

import com.coliseo.aforo.application.AforoService;
import com.coliseo.aforo.application.dto.AforoResponseDto;
import com.coliseo.aforo.application.dto.LecturaRequestDto;
import com.coliseo.aforo.domain.Lectura;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/aforo")
@Tag(name = "Aforo", description = "Control de aforo en tiempo real")
public class AforoController {

    private final AforoService aforoService;

    public AforoController(AforoService aforoService) {
        this.aforoService = aforoService;
    }

    @PostMapping("/lecturas")
    @Operation(summary = "Registrar lectura del sensor (ENTRADA o SALIDA)")
    public ResponseEntity<AforoResponseDto> registrarLectura(
            @Valid @RequestBody LecturaRequestDto dto) {
        AforoResponseDto respuesta = aforoService.registrarLectura(dto);
        return ResponseEntity.ok(respuesta);
    }

 
    @GetMapping("/estado")
    @Operation(summary = "Obtener estado actual del aforo")
    public ResponseEntity<AforoResponseDto> obtenerEstado(
            @RequestParam(defaultValue = "00000000-0000-0000-0000-000000000001") UUID eventoId) {
        return ResponseEntity.ok(aforoService.obtenerEstado(eventoId));
    }

    @PostMapping("/reset")
    @Operation(summary = "Resetear conteo del evento")
    public ResponseEntity<AforoResponseDto> resetear(
            @RequestParam(defaultValue = "00000000-0000-0000-0000-000000000001") UUID eventoId) {
        return ResponseEntity.ok(aforoService.resetear(eventoId));
    }


    @GetMapping("/historial")
    @Operation(summary = "Historial de lecturas del evento")
    public ResponseEntity<List<Lectura>> historial(
            @RequestParam(defaultValue = "00000000-0000-0000-0000-000000000001") UUID eventoId) {
        return ResponseEntity.ok(aforoService.obtenerHistorial(eventoId));
    }
}
