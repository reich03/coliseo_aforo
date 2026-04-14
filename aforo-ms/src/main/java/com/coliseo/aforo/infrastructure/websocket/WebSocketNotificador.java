package com.coliseo.aforo.infrastructure.websocket;

import com.coliseo.aforo.application.dto.AforoResponseDto;
import com.coliseo.aforo.application.port.IAlertaNotificador;
import com.coliseo.aforo.domain.Alerta;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;


@Component
public class WebSocketNotificador implements IAlertaNotificador {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificador(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void notificarEstado(AforoResponseDto estado) {
        messagingTemplate.convertAndSend("/topic/aforo-estado", estado);
    }

    @Override
    public void notificarAlerta(Alerta alerta) {
        messagingTemplate.convertAndSend("/topic/alertas", alerta);
    }
}
