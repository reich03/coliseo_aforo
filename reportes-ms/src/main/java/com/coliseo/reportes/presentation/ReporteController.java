package com.coliseo.reportes.presentation;

import com.coliseo.reportes.application.ReporteService;
import com.coliseo.reportes.domain.RegistroHistorico;
import com.coliseo.reportes.domain.ResumenEvento;
import com.coliseo.reportes.infrastructure.export.ExcelExporter;
import com.coliseo.reportes.infrastructure.export.PdfExporter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reportes")
@Tag(name = "Reportes", description = "Historial y exportación de reportes")
public class ReporteController {

    private final ReporteService reporteService;
    private final PdfExporter pdfExporter;
    private final ExcelExporter excelExporter;

    public ReporteController(ReporteService reporteService,
                              PdfExporter pdfExporter,
                              ExcelExporter excelExporter) {
        this.reporteService = reporteService;
        this.pdfExporter = pdfExporter;
        this.excelExporter = excelExporter;
    }

    @GetMapping("/evento/{eventoId}")
    @Operation(summary = "Resumen del evento")
    public ResponseEntity<ResumenEvento> resumen(@PathVariable UUID eventoId) {
        return ResponseEntity.ok(reporteService.calcularResumen(eventoId));
    }

    @GetMapping("/evento/{eventoId}/grafica")
    @Operation(summary = "Historial completo para gráfica por hora")
    public ResponseEntity<List<RegistroHistorico>> grafica(@PathVariable UUID eventoId) {
        return ResponseEntity.ok(reporteService.obtenerHistorial(eventoId));
    }

    @GetMapping("/evento/{eventoId}/pdf")
    @Operation(summary = "Descargar reporte en PDF")
    public ResponseEntity<byte[]> pdf(@PathVariable UUID eventoId) throws IOException {
        ResumenEvento resumen = reporteService.calcularResumen(eventoId);
        List<RegistroHistorico> historial = reporteService.obtenerHistorial(eventoId);
        byte[] bytes = pdfExporter.exportar(resumen, historial);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-" + eventoId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }

    @GetMapping("/evento/{eventoId}/excel")
    @Operation(summary = "Descargar reporte en Excel")
    public ResponseEntity<byte[]> excel(@PathVariable UUID eventoId) throws IOException {
        ResumenEvento resumen = reporteService.calcularResumen(eventoId);
        List<RegistroHistorico> historial = reporteService.obtenerHistorial(eventoId);
        byte[] bytes = excelExporter.exportar(resumen, historial);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-" + eventoId + ".xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bytes);
    }
    @PostMapping("/registro")
    @Operation(summary = "Guardar snapshot de aforo (llamado por Aforo MS)")
    public ResponseEntity<RegistroHistorico> guardar(
            @RequestParam UUID eventoId,
            @RequestParam int personasAdentro,
            @RequestParam int aforoMaximo) {
        return ResponseEntity.ok(reporteService.guardarRegistro(eventoId, personasAdentro, aforoMaximo));
    }
}
