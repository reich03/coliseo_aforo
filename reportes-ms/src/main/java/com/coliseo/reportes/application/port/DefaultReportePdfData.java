package com.coliseo.reportes.application.port;

import com.coliseo.reportes.domain.RegistroHistorico;
import com.coliseo.reportes.domain.ResumenEvento;

import java.util.List;

public class DefaultReportePdfData implements ReportePdfData {

    private final ResumenEvento resumen;
    private final List<RegistroHistorico> historial;

    public DefaultReportePdfData(ResumenEvento resumen, List<RegistroHistorico> historial) {
        this.resumen = resumen;
        this.historial = historial;
    }

    @Override
    public ResumenEvento getResumen() {
        return resumen;
    }

    @Override
    public List<RegistroHistorico> getHistorial() {
        return historial;
    }
}