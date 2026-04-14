import http from './http'
import { RegistroHistorico } from '../types'

const BASE = '/reportes'

export const guardarRegistro = (eventoId: string, personasAdentro: number, aforoMaximo: number) =>
  http.post(`${BASE}/registro`, null, {
    params: { eventoId, personasAdentro, aforoMaximo },
  }).then(r => r.data)

export const getResumen = (eventoId: string) =>
  http.get(`${BASE}/evento/${eventoId}`).then(r => r.data)

export const getGrafica = (eventoId: string) =>
  http.get<RegistroHistorico[]>(`${BASE}/evento/${eventoId}/grafica`).then(r => r.data)

export const downloadPdf = (eventoId: string) =>
  http.get(`${BASE}/evento/${eventoId}/pdf`, { responseType: 'blob' }).then(r => {
    const url = URL.createObjectURL(r.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-${eventoId}.pdf`
    a.click()
  })

export const downloadExcel = (eventoId: string) =>
  http.get(`${BASE}/evento/${eventoId}/excel`, { responseType: 'blob' }).then(r => {
    const url = URL.createObjectURL(r.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-${eventoId}.xlsx`
    a.click()
  })
