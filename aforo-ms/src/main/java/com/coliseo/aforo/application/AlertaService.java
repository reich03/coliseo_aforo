package com.coliseo.aforo.application;

import com.coliseo.aforo.application.dto.AforoResponseDto;
import com.coliseo.aforo.application.port.IAforoRepository;
import com.coliseo.aforo.application.port.IAlertaNotificador;
import com.coliseo.aforo.application.port.IPoliticaAforo;
import com.coliseo.aforo.domain.Aforo;
import org.springframework.stereotype.Service;

/**
 * GRASP High Cohesion — AlertaService tiene una sola responsabilidad:
 * coordinar la evaluación de política y la notificación de alertas.
 * No mezcla la lógica de umbrales (delegada a {@link IPoliticaAforo})
 * ni la de conteo (delegada al dominio {@link Aforo}).
 *
 * GRASP Low Coupling — depende de interfaces (IPoliticaAforo, IAlertaNotificador),
 * no de implementaciones concretas.
 */
@Service
public class AlertaService {

    private final IAlertaNotificador notificador;
    private final IAforoRepository aforoRepository;
    private final IPoliticaAforo politica;

    public AlertaService(IAlertaNotificador notificador,
                         IAforoRepository aforoRepository,
                         IPoliticaAforo politica) {
        this.notificador   = notificador;
        this.aforoRepository = aforoRepository;
        this.politica      = politica;
    }

    /**
     * @param aforo    
     * @param estadoDto
     */
    public void evaluarYNotificar(Aforo aforo, AforoResponseDto estadoDto) {
        notificador.notificarEstado(estadoDto);
        politica.evaluar(aforo)
                .ifPresent(notificador::notificarAlerta);
    }
}

