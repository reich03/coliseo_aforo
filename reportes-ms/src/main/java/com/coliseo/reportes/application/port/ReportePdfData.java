package com.coliseo.reportes.application.port;

import com.coliseo.reportes.domain.RegistroHistorico;
import com.coliseo.reportes.domain.ResumenEvento;

import java.util.List;

public interface ReportePdfData {

    ResumenEvento getResumen();

    List<RegistroHistorico> getHistorial();
}