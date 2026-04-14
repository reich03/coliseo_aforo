package com.coliseo.aforo.application;

import com.coliseo.aforo.application.port.IPoliticaAforo;
import com.coliseo.aforo.domain.Aforo;
import com.coliseo.aforo.domain.Alerta;
import com.coliseo.aforo.domain.EstadoAforo;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * GRASP Protected Variations — implementación estándar de {@link IPoliticaAforo}.
 *
 * Para un evento especial (concierto VIP, zona pista) se crea otra implementación
 * sin modificar esta clase ni {@link AlertaService}.
 */
@Component
public class PoliticaAforoEstandar implements IPoliticaAforo {

    private static final float UMBRAL_LLENO   = 100f;
    private static final float UMBRAL_ALTO    =  90f;
    private static final float UMBRAL_ALERTA  =  70f;

    
    @Override
    public Optional<Alerta> evaluar(Aforo aforo) {
        float pct = aforo.calcularPorcentaje();

        if (aforo.getEstado() == EstadoAforo.LLENO || pct >= UMBRAL_LLENO) {
            return Optional.of(new Alerta(
                    aforo.getId(),
                    "LLENO",
                    "¡Aforo máximo alcanzado! No se permiten más ingresos."));
        }

        if (pct >= UMBRAL_ALTO) {
            return Optional.of(new Alerta(
                    aforo.getId(),
                    "ALERTA_90",
                    "Aforo al 90 %. Restricción de ingreso recomendada."));
        }

        if (pct >= UMBRAL_ALERTA) {
            return Optional.of(new Alerta(
                    aforo.getId(),
                    "ALERTA_70",
                    "Aforo al 70 %. Monitoreo intensivo activado."));
        }

        return Optional.empty();   
    }
}
