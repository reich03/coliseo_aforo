import { useEffect, useMemo, useRef, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAforoSocket } from '../hooks/useAforoSocket'
import { useAforoStore } from '../store/aforoStore'
import { useAuthStore } from '../store/authStore'
import { getEstado } from '../api/aforoService'
import { getEventoActivo } from '../api/eventoService'
import { getGrafica, downloadPdf, downloadExcel } from '../api/reporteService'
import AlertaBanner from '../components/AlertaBanner'
import SimuladorSensor from '../components/SimuladorSensor'
import Layout from '../components/Layout'
import { Evento, RegistroHistorico } from '../types'

/* ── Circular Gauge ── */
function CircularGauge({ personas, max, pct, estado }: { personas: number; max: number; pct: number; estado: string }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = Math.min(pct / 100, 1) * circ
  const color = estado === 'LLENO' ? '#ef4444' : estado === 'ALERTA' ? '#eab308' : '#22c55e'
  return (
    <svg viewBox="0 0 100 100" className="w-36 h-36">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1a2a1a" strokeWidth="7" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">{personas}</text>
      <text x="50" y="58" textAnchor="middle" fill="#4a6a4a" fontSize="7.5" fontFamily="sans-serif">DE {max}</text>
    </svg>
  )
}

/* ── Semáforo ── */
function SemaforoPanel({ estado }: { estado: string }) {
  const cfg = {
    LIBRE:  { label: 'Aforo Libre',   sub: 'Entrada permitida. Flujo estable.', icon: '✓', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' },
    ALERTA: { label: 'Casi Lleno',    sub: 'Flujo reducido. Atención requerida.', icon: '!', bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.3)',  color: '#eab308' },
    LLENO:  { label: 'Aforo Máximo', sub: 'Acceso bloqueado.', icon: '✕', bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)',  color: '#ef4444' },
  }[estado] ?? { label: 'Sin datos', sub: '', icon: '?', bg: 'rgba(100,100,100,0.1)', border: 'rgba(100,100,100,0.2)', color: '#6b7280' }

  return (
    <div className="rounded-xl p-5 h-full flex flex-col items-center justify-center gap-4" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
      <p className="text-[9px] uppercase tracking-widest text-[#3a5a3a]">Sistema de Semáforo</p>
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition-all"
        style={{ background: cfg.bg, border: `2px solid ${cfg.border}`, color: cfg.color, boxShadow: `0 0 30px ${cfg.bg}` }}>
        {cfg.icon}
      </div>
      <div className="text-center">
        <p className="font-bold text-sm" style={{ color: cfg.color }}>{cfg.label}</p>
        <p className="text-[10px] text-[#4a6a4a] mt-0.5">{cfg.sub}</p>
      </div>
    </div>
  )
}

/* ── Stat Card ── */
function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
      <p className="text-[9px] uppercase tracking-widest text-[#3a5a3a] mb-2">{label}</p>
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      {delta && <p className="text-[10px] text-green-500 mt-1">▲ {delta}</p>}
    </div>
  )
}

/* ── Dashboard ── */
export default function Dashboard() {
  useAforoSocket()

  const { aforo, setAforo, setEventoActivo: storeSetEvento } = useAforoStore()
  const { username, isAdmin } = useAuthStore()
  const [historial, setHistorial] = useState<RegistroHistorico[]>([])
  const [eventoActivo, setEvento] = useState<Evento | null>(null)
  const [sinEvento, setSinEvento] = useState(false)
  const [totalEntradas, setTotalEntradas] = useState(0)
  const [totalSalidas, setTotalSalidas] = useState(0)
  const startRef = useRef<Date | null>(null)

  useEffect(() => {
    getEventoActivo()
      .then((ev) => { storeSetEvento(ev); setEvento(ev); setSinEvento(false); startRef.current = ev.fechaInicio ? new Date(ev.fechaInicio) : new Date() })
      .catch(() => { storeSetEvento(null); setEvento(null); setSinEvento(true) })
  }, [storeSetEvento])

  useEffect(() => {
    if (!eventoActivo) return
    const id = eventoActivo.id
    getEstado(id).then((e) => setAforo({ ...e, aforoMaximo: eventoActivo.aforoMaximo, eventoNombre: eventoActivo.nombre })).catch(() => {})
    getGrafica(id).then(setHistorial).catch(() => setHistorial([]))
  }, [eventoActivo, setAforo])

  /* Flow chart: entries/exits aggregated by 15-min intervals */
  const chartData = useMemo(() => {
    if (historial.length < 2) return []
    const buckets: Record<string, { t: string; entradas: number; salidas: number }> = {}
    for (let i = 1; i < historial.length; i++) {
      const diff = historial[i].personasAdentro - historial[i - 1].personasAdentro
      const dt = new Date(historial[i].timestamp)
      const mins = Math.floor(dt.getMinutes() / 15) * 15
      const key = `${String(dt.getHours()).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
      if (!buckets[key]) buckets[key] = { t: key, entradas: 0, salidas: 0 }
      if (diff > 0) buckets[key].entradas += diff
      else buckets[key].salidas += Math.abs(diff)
    }
    return Object.values(buckets).sort((a, b) => a.t.localeCompare(b.t))
  }, [historial])

  /* Running totals from historial */
  useEffect(() => {
    if (historial.length < 2) return
    let e = 0; let s = 0
    for (let i = 1; i < historial.length; i++) {
      const diff = historial[i].personasAdentro - historial[i - 1].personasAdentro
      if (diff > 0) e += diff; else s += Math.abs(diff)
    }
    setTotalEntradas((prev) => Math.max(prev, e))
    setTotalSalidas((prev) => Math.max(prev, s))
  }, [historial])

  /* Flow rate: movements per minute */
  const flowRate = useMemo(() => {
    if (!startRef.current || totalEntradas + totalSalidas === 0) return '—'
    const mins = (Date.now() - startRef.current.getTime()) / 60000
    if (mins < 0.5) return '—'
    return ((totalEntradas + totalSalidas) / mins).toFixed(1)
  }, [totalEntradas, totalSalidas])

  const pct = aforo?.porcentaje ?? 0
  const estado = aforo?.estado ?? 'LIBRE'
  const personas = aforo?.personasAdentro ?? 0
  const max = aforo?.aforoMaximo ?? eventoActivo?.aforoMaximo ?? 0

  const barColor = estado === 'LLENO' ? '#ef4444' : estado === 'ALERTA' ? '#eab308' : '#22c55e'

  const headerRight = (
    <>
      {eventoActivo && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-400">Evento Activo</span>
        </div>
      )}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px]" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
        <span className="text-white font-medium">{isAdmin ? 'Administrador' : 'Operador'} {username}</span>
        <span className="text-[#22c55e] text-[8px] uppercase tracking-widest border border-green-500/30 rounded px-1">Verificado UNILLANOS</span>
      </div>
      {eventoActivo && (
        <>
          <button onClick={() => downloadPdf(eventoActivo.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest text-white transition-all" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
            Reporte PDF
          </button>
          <button onClick={() => downloadExcel(eventoActivo.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest text-white transition-all" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-6m3 6v-3m3 3v-9M3 20h18" strokeWidth={2}/></svg>
            Reporte Excel
          </button>
        </>
      )}
    </>
  )

  return (
    <Layout title="Aforo General" subtitle="Panel de control de flujo de personas en tiempo real." headerRight={headerRight}>
      <AlertaBanner />

      {sinEvento && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl text-xs" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#eab308' }}>
          <span>⚠</span>
          <span>No hay evento activo. <a href="/eventos" className="underline">Ir a Eventos</a> para activar uno.</span>
        </div>
      )}

      {/* Row 1: gauge + semáforo */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Gauge panel */}
        <div className="col-span-2 rounded-xl p-6" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <div className="flex items-start gap-8">
            <CircularGauge personas={personas} max={max} pct={pct} estado={estado} />
            <div className="flex-1 pt-1">
              {eventoActivo && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Monitor en Vivo
                  </span>
                  <p className="text-white text-sm font-semibold mt-1 truncate">{eventoActivo.nombre}</p>
                </div>
              )}
              <p className="text-[10px] uppercase tracking-widest text-[#3a5a3a] mb-1">Estado de Capacidad</p>
              <h2 className="text-2xl font-bold text-white mb-4">Capacidad Actual</h2>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-[#3a5a3a]">Carga de Ocupación</span>
                <span className="text-sm font-bold" style={{ color: barColor }}>{pct.toFixed(1)}%</span>
              </div>
              <div className="w-full rounded-full h-2 mb-4" style={{ background: '#1a2a1a' }}>
                <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
              </div>
              <p className="text-[10px] text-[#3a5a3a] leading-relaxed">
                El sistema monitorea constantemente las entradas y salidas para garantizar la seguridad del recinto.
              </p>
            </div>
          </div>
        </div>
        {/* Semáforo */}
        <SemaforoPanel estado={estado} />
      </div>

      {/* Row 2: simulador + flow chart */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {eventoActivo ? (
          <SimuladorSensor
            eventoId={eventoActivo.id}
            aforoMaximo={eventoActivo.aforoMaximo}
            onEntrada={() => setTotalEntradas((n) => n + 1)}
            onSalida={() => setTotalSalidas((n) => n + 1)}
          />
        ) : (
          <div className="rounded-xl p-5 flex items-center justify-center text-[#2a3a2a] text-xs" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
            Sin evento activo
          </div>
        )}

        {/* Flow over time */}
        <div className="col-span-2 rounded-xl p-5" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <p className="text-[9px] uppercase tracking-widest text-[#3a5a3a] mb-1">Flujo en el Tiempo</p>
          <p className="text-[9px] text-[#2a3a2a] mb-4">Entradas vs Salidas por hora</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2a1a" vertical={false} />
                <XAxis dataKey="t" stroke="#2a3a2a" tick={{ fontSize: 10, fill: '#4a6a4a' }} />
                <YAxis stroke="#2a3a2a" tick={{ fontSize: 10, fill: '#4a6a4a' }} />
                <Tooltip contentStyle={{ background: '#0a100a', border: '1px solid #1a2a1a', borderRadius: 8 }} labelStyle={{ color: '#f0f0f0', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#4a6a4a', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="entradas" name="Entradas" fill="#22c55e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="salidas" name="Salidas" fill="#1a3a1a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-[#2a3a2a] text-xs uppercase tracking-widest">Sin datos de flujo</div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard label="Total Entradas" value={totalEntradas.toLocaleString()} delta={totalEntradas > 0 ? `+${Math.round((totalEntradas / Math.max(max, 1)) * 100)}%` : undefined} />
        <StatCard label="Total Salidas"  value={totalSalidas.toLocaleString()} delta={totalSalidas > 0 ? `+${Math.round((totalSalidas / Math.max(totalEntradas, 1)) * 100)}%` : undefined} />
        <StatCard label="Tiempo Promedio" value={
          (() => {
            if (totalEntradas === 0 || !startRef.current) return '— min'
            const mins = (Date.now() - startRef.current.getTime()) / 60000
            return `${Math.round(mins / Math.max(totalEntradas, 1))} min`
          })()
        } />
        <StatCard label="Tasa de Flujo" value={flowRate !== '—' ? `${flowRate} p/min` : '—'} />
      </div>
    </Layout>
  )
}
