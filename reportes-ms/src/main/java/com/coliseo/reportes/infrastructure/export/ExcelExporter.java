package com.coliseo.reportes.infrastructure.export;

import com.coliseo.reportes.domain.RegistroHistorico;
import com.coliseo.reportes.domain.ResumenEvento;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;


@Component
public class ExcelExporter {

    public byte[] exportar(ResumenEvento resumen, List<RegistroHistorico> historial) throws IOException {
        try (Workbook wb = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Sheet sheetResumen = wb.createSheet("Resumen");
            CellStyle boldStyle = wb.createCellStyle();
            Font boldFont = wb.createFont();
            boldFont.setBold(true);
            boldStyle.setFont(boldFont);

            String[][] resumenData = {
                    {"Evento ID", resumen.getEventoId().toString()},
                    {"Evento", resumen.getEventoNombre() != null ? resumen.getEventoNombre() : "—"},
                    {"Total registros", String.valueOf(resumen.getTotalRegistros())},
                    {"Pico máximo (personas)", String.valueOf(resumen.getPicoMaximo())},
                    {"Porcentaje pico", String.format("%.1f%%", resumen.getPorcentajePico())},
                    {"Hora pico", resumen.getHoraPico() != null ? resumen.getHoraPico().toString() : "—"},
            };

            for (int i = 0; i < resumenData.length; i++) {
                Row row = sheetResumen.createRow(i);
                Cell labelCell = row.createCell(0);
                labelCell.setCellValue(resumenData[i][0]);
                labelCell.setCellStyle(boldStyle);
                row.createCell(1).setCellValue(resumenData[i][1]);
            }
            sheetResumen.autoSizeColumn(0);
            sheetResumen.autoSizeColumn(1);

            Sheet sheetHistorial = wb.createSheet("Historial");

            Row headerRow = sheetHistorial.createRow(0);
            String[] headers = {"Timestamp", "Personas Adentro", "Aforo Máximo", "Porcentaje (%)"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(boldStyle);
            }

            int rowNum = 1;
            for (RegistroHistorico r : historial) {
                Row row = sheetHistorial.createRow(rowNum++);
                row.createCell(0).setCellValue(r.getTimestamp().toString());
                row.createCell(1).setCellValue(r.getPersonasAdentro());
                row.createCell(2).setCellValue(r.getAforoMaximo());
                row.createCell(3).setCellValue(r.getPorcentaje());
            }

            for (int i = 0; i < headers.length; i++) {
                sheetHistorial.autoSizeColumn(i);
            }

            wb.write(baos);
            return baos.toByteArray();
        }
    }
}
