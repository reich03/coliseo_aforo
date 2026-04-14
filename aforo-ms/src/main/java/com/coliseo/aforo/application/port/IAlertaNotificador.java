package com.coliseo.aforo.application.port;

import com.coliseo.aforo.application.dto.AforoResponseDto;
import com.coliseo.aforo.domain.Alerta;


public interface IAlertaNotificador {
    void notificarEstado(AforoResponseDto estado);
    void notificarAlerta(Alerta alerta);
}
