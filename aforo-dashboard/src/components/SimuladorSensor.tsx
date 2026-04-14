import { useState } from 'react'
import Swal from 'sweetalert2'
import { postLectura, resetAforo } from '../api/aforoService'
import { guardarRegistro } from '../api/reporteService'
import { useAforoStore } from '../store/aforoStore'

interface Props {
  eventoId: string
  aforoMaximo: number
  onEntrada?: () => void
  onSalida?: () => void
}

const SWL = { background: '#0a100a', color: '#f0f0f0' }

export default function SimuladorSensor({ eventoId, aforoMaximo, onEntrada, onSalida }: Props) {
  const setAforo = useAforoStore((s) => s.setAforo)
  const [loadingE, setLoadingE] = useState(false)
  const [loadingS, setLoadingS] = useState(false)
  const [lastRecord, setLastRecord] = useState<string | null>(null)

  const stamp = () => new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const handleEntrada = async () => {
    setLoadingE(true)
    try {
      const updated = await postLectura('ENTRADA', eventoId, aforoMaximo)
      setAforo(updated)
      guardarRegistro(eventoId, updated.personasAdentro, aforoMaximo).catch(() => {})
      setLastRecord(`${stamp()} · Sensor Puerta Norte`)
      onEntrada?.()
    } catch {
      Swal.fire({ icon: 'error', title: 'Error de entrada', text: '¿Está corriendo aforo-ms?', ...SWL, confirmButtonColor: '#dc2626' })
    } finally { setLoadingE(false) }
  }

  const handleSalida = async () => {
    setLoadingS(true)
    try {
      const updated = await postLectura('SALIDA', eventoId, aforoMaximo)
      setAforo(updated)
      guardarRegistro(eventoId, updated.personasAdentro, aforoMaximo).catch(() => {})
      setLastRecord(`${stamp()} · Sensor Puerta Norte`)
      onSalida?.()
    } catch {
      Swal.fire({ icon: 'error', title: 'Error de salida', text: '¿Hay personas adentro?', ...SWL, confirmButtonColor: '#dc2626' })
    } finally { setLoadingS(false) }
  }

  const handleReset = async () => {
    const c = await Swal.fire({ icon: 'warning', title: '¿Resetear conteo?', text: 'El contador volverá a 0.', showCancelButton: true, confirmButtonText: 'Resetear', cancelButtonText: 'Cancelar', confirmButtonColor: '#dc2626', ...SWL })
    if (!c.isConfirmed) return
    try {
      const updated = await resetAforo(eventoId)
      setAforo(updated)
      setLastRecord(null)
      Swal.fire({ icon: 'success', title: 'Conteo reseteado', timer: 1200, showConfirmButton: false, ...SWL })
    } catch {
      Swal.fire({ icon: 'error', title: 'Error al resetear', ...SWL, confirmButtonColor: '#dc2626' })
    }
  }

  return (
    <div className="rounded-xl p-5 h-full" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Simulador de Sensores</span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-[#3a5a3a]">Manual Override</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={handleEntrada} disabled={loadingE} className="flex flex-col items-center justify-center gap-2 rounded-xl py-6 transition-all disabled:opacity-50" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeWidth={2} strokeLinecap="round"/></svg>
          <span className="text-green-400 text-xs font-bold tracking-widest uppercase">+ Entrada</span>
        </button>
        <button onClick={handleSalida} disabled={loadingS} className="flex flex-col items-center justify-center gap-2 rounded-xl py-6 transition-all disabled:opacity-50" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth={2} strokeLinecap="round"/></svg>
          <span className="text-red-400 text-xs font-bold tracking-widest uppercase">- Salida</span>
        </button>
      </div>

      {lastRecord && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] text-[#4a7a4a]" style={{ background: '#0a120a', border: '1px solid #152015' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          Último registro: {lastRecord}
        </div>
      )}

      <button onClick={handleReset} className="mt-3 w-full text-[10px] uppercase tracking-widest text-[#3a4a3a] hover:text-red-400 py-1.5 transition-colors">
        ↺ Reset conteo
      </button>
    </div>
  )
}
