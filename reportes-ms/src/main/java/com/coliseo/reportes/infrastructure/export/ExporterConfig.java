package com.coliseo.reportes.infrastructure.export;

import com.coliseo.reportes.application.port.ReporteExporterPort;
import com.coliseo.reportes.infrastructure.service.JasperService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ExporterConfig {

    @Bean
    public ReporteExporterPort pdfExporter() {
        return new LoggingExporterDecorator(new PdfExporter());
    }

    @Bean
    public ReporteExporterPort excelExporter() {
        return new LoggingExporterDecorator(new ExcelExporter());
    }

    @Bean
    public ReporteExporterPort jasperReporter(JasperService jasperService) {
        return new LoggingExporterDecorator(new JasperReporter(jasperService));
    }
}
