import { useEffect } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAforoStore } from '../store/aforoStore'
import { AforoState, Alerta } from '../types'


export function useAforoSocket() {
  const setAforo = useAforoStore((s) => s.setAforo)
  const addAlerta = useAforoStore((s) => s.addAlerta)

  useEffect(() => {
    const socket = new SockJS('http://localhost:8085/ws-aforo')
    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      reconnectDelay: 5000,
    })

    client.onConnect = () => {
      console.log('[WS] Conectado al Aforo MS')

      client.subscribe('/topic/aforo-estado', (msg) => {
        const data: AforoState = JSON.parse(msg.body)
        setAforo(data)
      })

      client.subscribe('/topic/alertas', (msg) => {
        const alerta: Alerta = JSON.parse(msg.body)
        addAlerta(alerta)
      })
    }

    client.onDisconnect = () => {
      console.log('[WS] Desconectado del Aforo MS')
    }

    client.activate()
    return () => { client.deactivate() }
  }, [setAforo, addAlerta])
}
