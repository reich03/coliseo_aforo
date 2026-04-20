package com.coliseo.reportes.infrastructure.export;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.coliseo.reportes.application.port.ReporteExporterPort;
import com.coliseo.reportes.application.port.ReportePdfData;
import com.coliseo.reportes.domain.RegistroHistorico;
import com.coliseo.reportes.domain.ResumenEvento;

import jakarta.annotation.PostConstruct;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@Component
public class JasperReporter implements ReporteExporterPort {

    private JasperReport reportePrincipal;

    @PostConstruct
    public void compilar() throws JRException {
        try (InputStream inputStream = getClass().getResourceAsStream("/reports/reporte_evento.jrxml")) {
            if (inputStream == null) {
                throw new JRException("No se encontró la plantilla /reports/reporte_evento.jrxml");
            }

            reportePrincipal = JasperCompileManager.compileReport(inputStream);
        } catch (IOException exception) {
            throw new JRException("No fue posible cerrar la plantilla del reporte", exception);
        }
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

            JasperPrint print = JasperFillManager.fillReport(
                    reportePrincipal,
                    params,
                    new JRBeanCollectionDataSource(historial));

            return JasperExportManager.exportReportToPdf(print);
        } catch (JRException exception) {
            throw new IOException("No fue posible generar el PDF con JasperReporter", exception);
        }
    }

    @Override
    public String getFormat() {
        return "PDF";
    }
}