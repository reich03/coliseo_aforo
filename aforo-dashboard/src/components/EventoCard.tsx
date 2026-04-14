import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Evento, ResumenEvento } from '../types'
import { activarEvento, cerrarEvento, eliminarEvento } from '../api/eventoService'
import { getResumen } from '../api/reporteService'
import { useAforoStore } from '../store/aforoStore'

interface Props { evento: Evento; onRefresh: () => void }

const SWL = { background: '#0a100a', color: '#f0f0f0' }

const BADGE: Record<string, { cls: string; dot: string }> = {
  ACTIVO:     { cls: 'text-green-400 border-green-500/40 bg-green-500/10',  dot: 'bg-green-500' },
  CERRADO:    { cls: 'text-red-400 border-red-500/40 bg-red-500/10',        dot: 'bg-red-500' },
  PROGRAMADO: { cls: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10', dot: 'bg-yellow-500' },
}

export default function EventoCard({ evento, onRefresh }: Props) {
  const navigate = useNavigate()
  const aforoActivo = useAforoStore((s) => s.aforo)
  const [resumen, setResumen] = useState<ResumenEvento | null>(null)

  // Fetch peak stats for non-PROGRAMADO events
  useEffect(() => {
    if (evento.estado === 'PROGRAMADO') return
    getResumen(evento.id).then(setResumen).catch(() => {})
  }, [evento.id, evento.estado])

  const liveOcupacion =
    evento.estado === 'ACTIVO' && aforoActivo?.eventoId === evento.id
      ? aforoActivo?.porcentaje ?? 0
      : null

  const ocupacionPct =
    liveOcupacion !== null
      ? liveOcupacion
      : resumen
      ? resumen.porcentajePico
      : 0

  const barColor =
    ocupacionPct >= 100 ? '#ef4444' : ocupacionPct >= 70 ? '#eab308' : '#22c55e'

  const ocupLabel =
    evento.estado === 'ACTIVO' && liveOcupacion !== null
      ? 'Ocupación'
      : evento.estado === 'CERRADO'
      ? 'Pico'
      : 'Ventas'

  const badge = BADGE[evento.estado] ?? BADGE.PROGRAMADO

  const confirm = (msg: string, color = '#22c55e') =>
    Swal.fire({ icon: 'question', title: msg, showCancelButton: true, confirmButtonText: 'Confirmar', cancelButtonText: 'Cancelar', confirmButtonColor: color, ...SWL })

  const handleActivar = async () => {
    if (!(await confirm(`¿Activar "${evento.nombre}"?`)).isConfirmed) return
    try { await activarEvento(evento.id); onRefresh(); Swal.fire({ icon: 'success', title: 'Evento activado', timer: 1200, showConfirmButton: false, ...SWL }) }
    catch { Swal.fire({ icon: 'error', title: 'Error al activar', ...SWL, confirmButtonColor: '#dc2626' }) }
  }

  const handleCerrar = async () => {
    if (!(await confirm(`¿Cerrar "${evento.nombre}"?`, '#ca8a04')).isConfirmed) return
    try { await cerrarEvento(evento.id); onRefresh(); Swal.fire({ icon: 'success', title: 'Evento cerrado', timer: 1200, showConfirmButton: false, ...SWL }) }
    catch { Swal.fire({ icon: 'error', title: 'Error al cerrar', ...SWL, confirmButtonColor: '#dc2626' }) }
  }

  const handleEliminar = async () => {
    const r = await Swal.fire({ icon: 'warning', title: '¿Eliminar evento?', text: 'Esta acción no se puede deshacer.', showCancelButton: true, confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar', confirmButtonColor: '#dc2626', ...SWL })
    if (!r.isConfirmed) return
    try { await eliminarEvento(evento.id); onRefresh() }
    catch { Swal.fire({ icon: 'error', title: 'Error al eliminar', ...SWL, confirmButtonColor: '#dc2626' }) }
  }

  return (
    <div className="rounded-xl p-5 flex flex-col gap-3 transition-all hover:border-green-500/20" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-sm text-white leading-tight">{evento.nombre}</h3>
        <span className={`shrink-0 flex items-center gap-1.5 text-[9px] px-2 py-1 rounded-full border uppercase tracking-widest font-medium ${badge.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {evento.estado}
        </span>
      </div>

      <p className="text-[10px] text-[#3a5a3a] uppercase tracking-widest">
        Aforo {evento.estado === 'PROGRAMADO' ? 'proyectado' : 'máximo'}:{' '}
        <span className="text-white font-semibold">{evento.aforoMaximo.toLocaleString()}</span>
      </p>

      {evento.estado !== 'PROGRAMADO' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase tracking-widest text-[#3a5a3a]">{ocupLabel}</span>
            <span className="text-[10px] font-bold" style={{ color: barColor }}>{ocupacionPct.toFixed(0)}%</span>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ background: '#1a2a1a' }}>
            <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(ocupacionPct, 100)}%`, background: barColor }} />
          </div>
        </div>
      )}

      <div className="space-y-0.5">
        {evento.fechaInicio && (
          <p className="text-[9px] text-green-600">Inicio: {new Date(evento.fechaInicio).toLocaleString('es-CO')}</p>
        )}
        {evento.fechaFin && (
          <p className="text-[9px] text-red-600">Fin: {new Date(evento.fechaFin).toLocaleString('es-CO')}</p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button onClick={handleEliminar} className="px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round"/></svg>
        </button>
        {evento.estado === 'PROGRAMADO' && (
          <button onClick={handleActivar} className="flex-1 text-[10px] uppercase tracking-widest font-bold py-1.5 rounded-lg transition-colors" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
            Activar
          </button>
        )}
        {evento.estado === 'ACTIVO' && (
          <button onClick={handleCerrar} className="flex-1 text-[10px] uppercase tracking-widest font-bold py-1.5 rounded-lg transition-colors" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#eab308' }}>
            Cerrar
          </button>
        )}
        <button onClick={() => navigate(`/eventos/${evento.id}`)} className="flex-1 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest font-medium py-1.5 rounded-lg transition-colors text-[#6b8a6b] hover:text-green-400" style={{ background: '#0a120a', border: '1px solid #1a2a1a' }}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-6m3 6v-3m3 3v-9M3 20h18" strokeWidth={2}/></svg>
          Ver Historial del Evento
        </button>
      </div>
    </div>
  )
}
