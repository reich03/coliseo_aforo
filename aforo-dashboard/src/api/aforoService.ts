import http from './http'
import { AforoState, RegistroHistorico } from '../types'

const BASE = '/aforo'

export const getEstado = (eventoId?: string) =>
  http.get<AforoState>(`${BASE}/estado`, { params: { eventoId } }).then(r => r.data)

export const postLectura = (tipo: 'ENTRADA' | 'SALIDA', eventoId?: string, aforoMaximo?: number) =>
  http.post<AforoState>(`${BASE}/lecturas`, { tipo, eventoId, aforoMaximo }).then(r => r.data)

export const resetAforo = (eventoId?: string) =>
  http.post<AforoState>(`${BASE}/reset`, null, { params: { eventoId } }).then(r => r.data)

export const getHistorial = (eventoId?: string) =>
  http.get<RegistroHistorico[]>(`${BASE}/historial`, { params: { eventoId } }).then(r => r.data)
