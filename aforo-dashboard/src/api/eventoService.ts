import http from './http'
import { Evento } from '../types'

const BASE = '/eventos'

export const getEventos = () =>
  http.get<Evento[]>(BASE).then(r => r.data)

export const getEventoActivo = () =>
  http.get<Evento>(`${BASE}/activo`).then(r => r.data)

export const crearEvento = (nombre: string, aforoMaximo: number) =>
  http.post<Evento>(BASE, { nombre, aforoMaximo }).then(r => r.data)

export const activarEvento = (id: string) =>
  http.put<Evento>(`${BASE}/${id}/activar`).then(r => r.data)

export const cerrarEvento = (id: string) =>
  http.put<Evento>(`${BASE}/${id}/cerrar`).then(r => r.data)

export const eliminarEvento = (id: string) =>
  http.delete(`${BASE}/${id}`)
