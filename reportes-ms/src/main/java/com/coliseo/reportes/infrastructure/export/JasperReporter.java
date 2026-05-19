package com.coliseo.reportes.infrastructure.export;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.coliseo.reportes.application.port.ReporteExporterPort;
import com.coliseo.reportes.application.port.ReportePdfData;
import com.coliseo.reportes.domain.RegistroHistorico;
import com.coliseo.reportes.domain.ResumenEvento;
import com.coliseo.reportes.infrastructure.service.JasperService;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public class JasperReporter implements ReporteExporterPort {

    private final JasperService jasperService;

    public JasperReporter(JasperService jasperService) {
        this.jasperService = jasperService;
    }

    @Override
    public byte[] exportar(ReportePdfData data) throws IOException {
        ResumenEvento resumen = data.getResumen();
        List<RegistroHistorico> historial = data.getHistorial();

        try {
            Map<String, Object> params = new HashMap<>();
            params.put("EVENTO_ID", resumen.getEventoId() != null ? resumen.getEventoId().toString() : "—");
            params.put("EVENTO_NOMBRE", resumen.getEventoNombre() != null && !resumen.getEventoNombre().isBlank()
                    ? resumen.getEventoNombre()
                    : "Evento sin nombre");
            params.put("TOTAL_REGISTROS", resumen.getTotalRegistros());
            params.put("PICO_MAXIMO", resumen.getPicoMaximo());
            params.put("PORCENTAJE_PICO", resumen.getPorcentajePico());
            params.put("HORA_PICO", resumen.getHoraPico());
            params.put("SUBTITULO", "Detalle de aforo y evolución histórica");

            JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(historial);
            return jasperService.generatePdf(params, ds);
        } catch (JRException exception) {
            throw new IOException("No fue posible generar el PDF con JasperReporter", exception);
        }
    }

    @Override
    public String getFormat() {
        return "PDF";
    }
}