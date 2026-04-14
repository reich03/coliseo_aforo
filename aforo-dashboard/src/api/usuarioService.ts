import http from './http'
import { RegisterRequestDto, UsuarioDto } from '../types'

const BASE = '/usuarios'

export const getUsuarios = () =>
  http.get<UsuarioDto[]>(BASE).then(r => r.data)

export const activarUsuario = (id: string) =>
  http.put<UsuarioDto>(`${BASE}/${id}/activar`).then(r => r.data)

export const desactivarUsuario = (id: string) =>
  http.put<UsuarioDto>(`${BASE}/${id}/desactivar`).then(r => r.data)

export const registrarUsuario = (dto: RegisterRequestDto) =>
  http.post<UsuarioDto>(`${BASE}/register`, dto).then(r => r.data)
