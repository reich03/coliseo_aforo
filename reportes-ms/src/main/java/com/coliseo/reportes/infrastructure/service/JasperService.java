package com.coliseo.reportes.infrastructure.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.springframework.stereotype.Service;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;

@Service
public class JasperService {

    private JasperReport reportePrincipal;

    public void init() throws JRException {
        try (InputStream inputStream = getClass().getResourceAsStream("/reports/reporte_evento.jrxml")) {
            if (inputStream == null) {
                throw new JRException("No se encontró la plantilla /reports/reporte_evento.jrxml");
            }

            reportePrincipal = JasperCompileManager.compileReport(inputStream);
        } catch (IOException exception) {
            throw new JRException("No fue posible cerrar la plantilla del reporte", exception);
        }
    }

    // Lazy initialization to avoid startup issues in tests
    private void ensureCompiled() throws JRException {
        if (reportePrincipal == null) {
            init();
        }
    }

    public byte[] generatePdf(Map<String, Object> params, JRDataSource dataSource) throws JRException {
        ensureCompiled();
        JasperPrint print = JasperFillManager.fillReport(reportePrincipal, params, dataSource);
        return JasperExportManager.exportReportToPdf(print);
    }
}
