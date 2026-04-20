package com.coliseo.reportes.application.port;

import java.io.IOException;

public interface ReporteExporterPort {

    byte[] exportar(ReportePdfData data) throws IOException;

    String getFormat();
}