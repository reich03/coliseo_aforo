package com.coliseo.reportes.infrastructure.export;

import com.coliseo.reportes.application.port.ReporteExporterPort;
import com.coliseo.reportes.application.port.ReportePdfData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LoggingExporterDecorator implements ReporteExporterPort {

    private static final Logger log = LoggerFactory.getLogger(LoggingExporterDecorator.class);
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final ReporteExporterPort delegate;

    public LoggingExporterDecorator(ReporteExporterPort delegate) {
        this.delegate = delegate;
    }

    @Override
    public byte[] exportar(ReportePdfData data) throws IOException {
        String formato   = getFormat();
        String eventoId  = data.getResumen() != null && data.getResumen().getEventoId() != null
                           ? data.getResumen().getEventoId().toString()
                           : "desconocido";
        String inicio    = LocalDateTime.now().format(FMT);

        log.info("[Exportacion] INICIO  | formato={} | eventoId={} | timestamp={}",
                formato, eventoId, inicio);

        long t0 = System.currentTimeMillis();
        byte[] resultado = delegate.exportar(data);
        long elapsed     = System.currentTimeMillis() - t0;

        log.info("[Exportacion] FIN     | formato={} | eventoId={} | duracion={}ms | bytes={}",
                formato, eventoId, elapsed, resultado != null ? resultado.length : 0);

        return resultado;
    }

    @Override
    public String getFormat() {
        return delegate.getFormat();
    }

    public ReporteExporterPort getDelegate() {
        return delegate;
    }
}
