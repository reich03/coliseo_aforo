import { create } from 'zustand'
import { AforoState, Alerta, Evento } from '../types'

interface AforoStore {
  aforo: AforoState | null
  alertas: Alerta[]
  eventoActivo: Evento | null
  setAforo: (aforo: AforoState) => void
  setEventoActivo: (evento: Evento | null) => void
  addAlerta: (alerta: Alerta) => void
  clearAlertas: () => void
}

export const useAforoStore = create<AforoStore>((set, get) => ({
  aforo: null,
  alertas: [],
  eventoActivo: null,

  setEventoActivo: (evento) => set({ eventoActivo: evento }),

  setAforo: (aforo) => {
    const ev = get().eventoActivo
    const patched: AforoState = ev
      ? { ...aforo, aforoMaximo: ev.aforoMaximo, eventoNombre: ev.nombre }
      : aforo
    const pct = patched.aforoMaximo > 0
      ? (patched.personasAdentro / patched.aforoMaximo) * 100
      : 0
    set({ aforo: { ...patched, porcentaje: parseFloat(pct.toFixed(1)) } })
  },

  addAlerta: (alerta) =>
    set((state) => ({ alertas: [alerta, ...state.alertas].slice(0, 20) })),

  clearAlertas: () => set({ alertas: [] }),
}))
