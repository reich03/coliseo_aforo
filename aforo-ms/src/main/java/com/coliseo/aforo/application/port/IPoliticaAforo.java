package com.coliseo.aforo.application.port;

import com.coliseo.aforo.domain.Aforo;
import com.coliseo.aforo.domain.Alerta;

import java.util.Optional;

/**
 * GRASP Protected Variations — abstracción sobre la política de umbrales de aforo.
 *
 * Permite cambiar o extender las reglas de capacidad (por evento, por zona,
 * por categoría de recinto) sin modificar AlertaService.
 *
 * Ejemplo: hoy 70 % / 90 % / 100 %; mañana 60 % / 80 % para eventos VIP.
 */
public interface IPoliticaAforo {

    /**
     * Evalúa el estado del aforo y devuelve una {@link Alerta} si se supera
     * algún umbral definido por esta política. Si no hay violación, retorna empty.
     *
     * @param aforo estado actual del aforo con personasAdentro y aforoMaximo
     * @return Optional con la alerta generada, vacío si todo está dentro del límite
     */
    Optional<Alerta> evaluar(Aforo aforo);
}
