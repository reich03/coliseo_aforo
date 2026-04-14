import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Evento, RegistroHistorico, ResumenEvento } from '../types'
import { getEventos } from '../api/eventoService'
import { getResumen, getGrafica, downloadPdf, downloadExcel } from '../api/reporteService'
import Layout from '../components/Layout'

function fmt(d: string | null) {
  if (!d) return 'En progreso...'
  return new Date(d).toLocaleString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function pctBadge(pct: number) {
  if (pct >= 100) return { label: 'Aforo Completo', cls: 'text-red-400 border-red-500/30 bg-red-500/10' }
  if (pct >= 70)  return { label: 'Aforo Alto',     cls: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' }
  return              { label: 'Aforo Normal',   cls: 'text-green-400 border-green-500/30 bg-green-500/10' }
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#0a120a', border: '1px solid #152015' }}>
      <p className="text-[9px] uppercase tracking-widest text-[#2a3a2a] mb-2">{label}</p>
      <p className="text-2xl font-bold tabular-nums" style={{ color: accent ?? '#ffffff' }}>{value}</p>
      {sub && <p className="text-[10px] text-[#3a5a3a] mt-0.5">{sub}</p>}
    </div>
  )
}

export default function EventoDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [evento, setEvento] = useState<Evento | null>(null)
  const [resumen, setResumen] = useState<ResumenEvento | null>(null)
  const [grafica, setGrafica] = useState<RegistroHistorico[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      getEventos().then((list) => list.find((e) => e.id === id) ?? null),
      getResumen(id).catch(() => null),
      getGrafica(id).catch(() => []),
    ]).then(([ev, res, grf]) => {
      setEvento(ev)
      setResumen(res)
      setGrafica(grf ?? [])
    }).finally(() => setLoading(false))
  }, [id])

  /* Chart: group by 15-min buckets */
  const chartData = useMemo(() => {
    if (grafica.length < 2) return []
    const step = Math.max(1, Math.floor(grafica.length / 60))
    return grafica
      .filter((_, i) => i % step === 0)
      .map((r) => ({
        t: new Date(r.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        personas: r.personasAdentro,
      }))
  }, [grafica])

  /* Avg occupancy */
  const promedio = grafica.length > 0
    ? parseFloat((grafica.reduce((a, r) => a + r.personasAdentro, 0) / grafica.length).toFixed(1))
    : null
  const promedioPct = promedio !== null && evento && evento.aforoMaximo > 0
    ? parseFloat(((promedio / evento.aforoMaximo) * 100).toFixed(1))
    : null

  /* Operative log: first record + peak */
  const logItems = useMemo(() => {
    const items: { time: string; label: string; sub: string }[] = []
    if (evento?.fechaInicio) items.push({ time: fmt(evento.fechaInicio), label: 'Apertura de puertas', sub: 'Inicio del conteo' })
    if (resumen?.horaPico) items.push({ time: fmt(resumen.horaPico), label: 'Pico máximo detectado', sub: `${resumen.picoMaximo} personas · ${resumen.porcentajePico.toFixed(1)}% aforo` })
    if (evento?.fechaFin) items.push({ time: fmt(evento.fechaFin), label: 'Cierre del evento', sub: 'Fin del conteo' })
    return items
  }, [evento, resumen])

  /* Trend analysis */
  const tendencia = useMemo(() => {
    if (grafica.length < 4) return null
    const last = grafica.slice(-Math.min(10, grafica.length))
    const diffs = last.slice(1).map((r, i) => r.personasAdentro - last[i].personasAdentro)
    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length
    if (avg > 0.5) return { dir: 'creciente', text: 'El evento muestra un crecimiento lineal controlado. No se prevén saturaciones en los próximos 30 minutos según la tendencia actual.' }
    if (avg < -0.5) return { dir: 'decreciente', text: 'El flujo de salida supera las entradas. Operación en fase de cierre. Carga reducida prevista.' }
    return { dir: 'estable', text: 'La ocupación se mantiene estable. Sin cambios significativos en el flujo actual.' }
  }, [grafica])

  const badge = resumen ? pctBadge(resumen.porcentajePico) : null
  const estadoBadge = evento
    ? { ACTIVO: 'text-green-400 border-green-500/30 bg-green-500/10', CERRADO: 'text-red-400 border-red-500/30 bg-red-500/10', PROGRAMADO: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' }[evento.estado]
    : ''

  const headerRight = (
    <>
      {id && (
        <>
          <button onClick={async () => { setExporting('pdf'); try { await downloadPdf(id) } finally { setExporting(null) } }} disabled={exporting !== null} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest text-white transition-all disabled:opacity-50" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm2 11h-3v3h-2v-3H8v-2h3V8h2v3h3v2z"/></svg>
            {exporting === 'pdf' ? 'Generando...' : 'Descargar PDF'}
          </button>
          <button onClick={async () => { setExporting('excel'); try { await downloadExcel(id) } finally { setExporting(null) } }} disabled={exporting !== null} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold text-black transition-all disabled:opacity-50" style={{ background: '#22c55e' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-6m3 6v-3m3 3v-9M3 20h18" strokeWidth={2}/></svg>
            {exporting === 'excel' ? 'Generando...' : 'Descargar Excel'}
          </button>
        </>
      )}
    </>
  )

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64 text-[#2a3a2a] text-sm uppercase tracking-widest">Cargando datos del evento...</div>
    </Layout>
  )

  return (
    <Layout headerRight={headerRight}>
      {/* Back button */}
      <button onClick={() => navigate('/eventos')} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#3a5a3a] hover:text-green-400 mb-6 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round"/></svg>
        Volver a Eventos
      </button>

      {/* Title */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        {evento && <span className={`text-[9px] px-2.5 py-1 rounded-full border uppercase tracking-widest font-medium ${estadoBadge}`}>{evento.estado}</span>}
        {badge && <span className={`text-[9px] px-2.5 py-1 rounded-full border uppercase tracking-widest font-medium ${badge.cls}`}>{badge.label}</span>}
        {evento && <span className="text-[9px] text-[#3a5a3a] uppercase tracking-widest">Aforo máx: {evento.aforoMaximo.toLocaleString()}</span>}
      </div>
      <h1 className="text-3xl font-bold text-white mb-1">{evento?.nombre ?? '—'}</h1>
      <p className="text-[#3a5a3a] text-xs mb-8">Reporte detallado de afluencia y métricas operativas</p>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-5" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeWidth={2}/></svg>
            <p className="text-[9px] uppercase tracking-widest text-[#3a5a3a]">Inicio de Evento</p>
          </div>
          <p className="text-white font-semibold text-sm">{fmt(evento?.fechaInicio ?? null)}</p>
        </div>
        <div className="rounded-xl p-5" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[#3a5a3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth={2}/></svg>
            <p className="text-[9px] uppercase tracking-widest text-[#3a5a3a]">Fin de Evento</p>
          </div>
          <p className="text-white font-semibold text-sm">{fmt(evento?.fechaFin ?? null)}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="Registros" value={String(resumen?.totalRegistros ?? 0)} sub="personas" accent="#22c55e" />
        <Stat label="Pico Máximo" value={resumen ? `${resumen.picoMaximo}` : '—'} sub="pers." accent="#22c55e" />
        <Stat label="% Pico" value={resumen ? `${resumen.porcentajePico.toFixed(1)}` : '—'} sub="%" accent={resumen ? (resumen.porcentajePico >= 100 ? '#ef4444' : resumen.porcentajePico >= 70 ? '#eab308' : '#22c55e') : '#6b7280'} />
        <Stat label="Promedio Ocupación" value={promedioPct !== null ? `${promedioPct}` : '—'} sub="%" accent={promedioPct !== null ? (promedioPct >= 70 ? '#eab308' : '#22c55e') : '#6b7280'} />
      </div>

      {/* Analysis + Chart */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* Occupancy analysis */}
        <div className="rounded-xl p-6" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <p className="text-[9px] uppercase tracking-widest text-[#2a3a2a] mb-4">Análisis de Ocupación</p>
          {promedio !== null ? (
            <>
              <p className="text-4xl font-bold text-white mb-1">{promedio}</p>
              <p className="text-[#3a5a3a] text-xs mb-4">personas</p>
              <div className="w-full rounded-full h-1.5 mb-4" style={{ background: '#1a2a1a' }}>
                <div className="h-1.5 rounded-full" style={{ width: `${Math.min(promedioPct ?? 0, 100)}%`, background: '#22c55e' }} />
              </div>
              <p className="text-[10px] text-[#3a5a3a]">
                El promedio de ocupación se mantiene en un nivel{' '}
                <span className="text-green-400 font-medium uppercase">
                  {(promedioPct ?? 0) >= 80 ? 'alto' : (promedioPct ?? 0) >= 50 ? 'medio' : 'óptimo'} ({promedioPct}%)
                </span>{' '}
                con respecto al aforo máximo de {evento?.aforoMaximo.toLocaleString()}.
              </p>
              {resumen?.horaPico && (
                <div className="mt-5 pt-4 border-t border-[#152015]">
                  <p className="text-[9px] uppercase tracking-widest text-[#2a3a2a] mb-1">Hora del Pico Máximo</p>
                  <p className="text-green-400 text-sm font-semibold">{fmt(resumen.horaPico)}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-[#2a3a2a] text-xs">Sin datos suficientes para el análisis.</p>
          )}
        </div>

        {/* Flow chart */}
        <div className="rounded-xl p-6" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <p className="text-[9px] uppercase tracking-widest text-[#2a3a2a] mb-1">Flujo de Personas Durante el Evento</p>
          <p className="text-[9px] text-[#1a2a1a] mb-4">Monitoreo en tiempo real · Última actualización 1 min atrás</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#152015" vertical={false} />
                <XAxis dataKey="t" stroke="#1a2a1a" tick={{ fontSize: 9, fill: '#3a5a3a' }} />
                <YAxis stroke="#1a2a1a" tick={{ fontSize: 9, fill: '#3a5a3a' }} />
                <Tooltip contentStyle={{ background: '#0a100a', border: '1px solid #1a2a1a', borderRadius: 8 }} labelStyle={{ color: '#f0f0f0', fontSize: 10 }} />
                <Bar dataKey="personas" name="Personas" fill="#22c55e" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#2a3a2a] text-xs uppercase tracking-widest">Sin datos registrados</div>
          )}
        </div>
      </div>

      {/* Operative log + trend */}
      <div className="grid grid-cols-2 gap-5">
        {/* Operative log */}
        <div className="rounded-xl p-6" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <p className="text-[9px] uppercase tracking-widest text-[#2a3a2a] mb-4">Registro Operativo</p>
          <div className="space-y-4">
            {logItems.length === 0 && <p className="text-[#2a3a2a] text-xs">Sin registros operativos.</p>}
            {logItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-white text-xs font-medium">{item.label}</p>
                  <p className="text-[10px] text-[#3a5a3a]">{item.time} · {item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend analysis */}
        <div className="rounded-xl p-6 flex flex-col items-center justify-center text-center" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: '#0a120a', border: '1px solid #152015' }}>
            <svg className="w-7 h-7 text-[#2a3a2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth={2}/></svg>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-[#2a3a2a] mb-3">Análisis de Tendencia</p>
          {tendencia ? (
            <p className="text-[#4a6a4a] text-xs leading-relaxed">{tendencia.text}</p>
          ) : (
            <p className="text-[#2a3a2a] text-xs">Se necesitan más registros para el análisis.</p>
          )}
          <p className="text-[#1a2a1a] text-[9px] uppercase tracking-widest mt-4">Reporte generado por UNILLANOS</p>
        </div>
      </div>
    </Layout>
  )
}
