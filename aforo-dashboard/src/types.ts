
export type EstadoAforo = 'LIBRE' | 'ALERTA' | 'LLENO'
export type EstadoEvento = 'PROGRAMADO' | 'ACTIVO' | 'CERRADO'

export interface AforoState {
  id: string
  eventoId: string
  eventoNombre: string
  personasAdentro: number
  aforoMaximo: number
  porcentaje: number
  estado: EstadoAforo
}

export interface Evento {
  id: string
  nombre: string
  aforoMaximo: number
  estado: EstadoEvento
  fechaInicio: string | null
  fechaFin: string | null
}

export interface Alerta {
  id: string
  aforoId: string
  tipo: string
  mensaje: string
  timestamp: string
}

export interface RegistroHistorico {
  id: string
  eventoId: string
  personasAdentro: number
  aforoMaximo: number
  porcentaje: number
  timestamp: string
}

export interface UsuarioDto {
  id: string
  username: string
  email: string
  active: boolean
}

export interface ResumenEvento {
  eventoId: string
  eventoNombre: string
  totalRegistros: number
  picoMaximo: number
  porcentajePico: number
  horaPico: string | null
}

export interface RegisterRequestDto {
  username: string
  email: string
  password: string
}
