package com.coliseo.reportes.infrastructure.export;

import com.coliseo.reportes.domain.RegistroHistorico;
import com.coliseo.reportes.domain.ResumenEvento;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;


@Component
public class PdfExporter {

    public byte[] exportar(ResumenEvento resumen, List<RegistroHistorico> historial) throws IOException {
        try (PDDocument doc = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font fontNormal = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                float y = 750;
                float margin = 50;

                cs.beginText();
                cs.setFont(fontBold, 16);
                cs.newLineAtOffset(margin, y);
                cs.showText("Reporte de Aforo — Coliseo Álvaro Mesa Amaya");
                cs.endText();
                y -= 25;

                cs.beginText();
                cs.setFont(fontNormal, 11);
                cs.newLineAtOffset(margin, y);
                cs.showText("Evento ID: " + resumen.getEventoId());
                cs.endText();
                y -= 18;

                cs.beginText();
                cs.setFont(fontNormal, 11);
                cs.newLineAtOffset(margin, y);
                cs.showText("Total registros: " + resumen.getTotalRegistros());
                cs.endText();
                y -= 18;

                cs.beginText();
                cs.setFont(fontNormal, 11);
                cs.newLineAtOffset(margin, y);
                cs.showText("Pico máximo: " + resumen.getPicoMaximo() +
                        " personas (" + String.format("%.1f", resumen.getPorcentajePico()) + "%)");
                cs.endText();
                y -= 18;

                if (resumen.getHoraPico() != null) {
                    cs.beginText();
                    cs.setFont(fontNormal, 11);
                    cs.newLineAtOffset(margin, y);
                    cs.showText("Hora pico: " + resumen.getHoraPico());
                    cs.endText();
                    y -= 30;
                }

                cs.beginText();
                cs.setFont(fontBold, 10);
                cs.newLineAtOffset(margin, y);
                cs.showText("Timestamp                    Personas    Aforo Máx.    %");
                cs.endText();
                y -= 5;

                // Línea separadora
                cs.moveTo(margin, y);
                cs.lineTo(550, y);
                cs.stroke();
                y -= 14;

                // Filas
                for (RegistroHistorico r : historial) {
                    if (y < 60) {
                        cs.close();
                        PDPage newPage = new PDPage(PDRectangle.A4);
                        doc.addPage(newPage);
                        break;
                    }
                    cs.beginText();
                    cs.setFont(fontNormal, 9);
                    cs.newLineAtOffset(margin, y);
                    String linea = String.format("%-28s %-11d %-13d %.1f%%",
                            r.getTimestamp(), r.getPersonasAdentro(), r.getAforoMaximo(), r.getPorcentaje());
                    cs.showText(linea);
                    cs.endText();
                    y -= 13;
                }
            }

            doc.save(baos);
            return baos.toByteArray();
        }
    }
}
