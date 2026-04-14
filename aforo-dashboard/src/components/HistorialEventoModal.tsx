import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { Evento, RegistroHistorico, ResumenEvento } from '../types'
import { getResumen, getGrafica, downloadPdf, downloadExcel } from '../api/reporteService'

interface Props {
  evento: Evento
  onClose: () => void
}

const SWL_STYLE = 'background:#1f2937;color:#f9fafb' 

function fmt(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function pctColor(pct: number) {
  if (pct >= 100) return 'text-red-400'
  if (pct >= 70) return 'text-yellow-400'
  return 'text-green-400'
}

function llenoBadge(pct: number) {
  if (pct >= 100) return { label: 'Estuvo LLENO', cls: 'bg-red-900 text-red-200' }
  if (pct >= 70) return { label: 'Llegó a ALERTA', cls: 'bg-yellow-900 text-yellow-200' }
  return { label: 'Aforo normal', cls: 'bg-green-900 text-green-200' }
}

export default function HistorialEventoModal({ evento, onClose }: Props) {
  const [resumen, setResumen] = useState<ResumenEvento | null>(null)
  const [grafica, setGrafica] = useState<RegistroHistorico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    Promise.all([
      getResumen(evento.id).catch(() => null),
      getGrafica(evento.id).catch(() => []),
    ]).then(([res, grf]) => {
      setResumen(res)
      setGrafica(grf ?? [])
    }).catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [evento.id])

  // Promedio de ocupación
  const promedio =
    grafica.length > 0
      ? parseFloat(
          (
            grafica.reduce((acc, r) => acc + r.personasAdentro, 0) /
            grafica.length
          ).toFixed(1),
        )
      : null

  const promedioPct =
    promedio !== null && evento.aforoMaximo > 0
      ? parseFloat(((promedio / evento.aforoMaximo) * 100).toFixed(1))
      : null

  const step = Math.max(1, Math.floor(grafica.length / 60))
  const chartData = grafica
    .filter((_, i) => i % step === 0)
    .map((r) => ({
      t: new Date(r.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      personas: r.personasAdentro,
    }))

  const badge = resumen ? llenoBadge(resumen.porcentajePico) : null

  const handlePdf = async () => {
    setExporting('pdf')
    try { await downloadPdf(evento.id) } finally { setExporting(null) }
  }

  const handleExcel = async () => {
    setExporting('excel')
    try { await downloadExcel(evento.id) } finally { setExporting(null) }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">{evento.nombre}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${evento.estado === 'ACTIVO' ? 'bg-green-700 text-green-100'
                  : evento.estado === 'CERRADO' ? 'bg-red-800 text-red-200'
                  : 'bg-gray-600 text-gray-200'}`}>
                {evento.estado}
              </span>
              {badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none mt-0.5"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Inicio</p>
              <p className="text-white text-sm font-medium">{fmt(evento.fechaInicio)}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Fin</p>
              <p className="text-white text-sm font-medium">{fmt(evento.fechaFin)}</p>
            </div>
          </div>

          {loading && (
            <p className="text-gray-400 text-sm text-center py-8">Cargando datos del historial…</p>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center py-8">
              No se pudo cargar el historial. Verifica que reportes-ms esté activo.
            </p>
          )}

          {!loading && !error && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Registros" value={resumen?.totalRegistros ?? 0} />
                <StatCard
                  label="Pico máximo"
                  value={resumen ? `${resumen.picoMaximo} pers.` : '—'}
                />
                <StatCard
                  label="% pico"
                  value={resumen ? `${resumen.porcentajePico.toFixed(1)}%` : '—'}
                  valueClass={resumen ? pctColor(resumen.porcentajePico) : ''}
                />
                <StatCard
                  label="Aforo máx."
                  value={evento.aforoMaximo.toLocaleString()}
                />
              </div>

              {/* Promedio */}
              {promedio !== null && (
                <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">
                      Promedio de ocupación
                    </p>
                    <p className="text-white text-2xl font-bold mt-0.5">
                      {promedio}{' '}
                      <span className="text-gray-400 text-base font-normal">personas</span>
                    </p>
                  </div>
                  {promedioPct !== null && (
                    <span className={`text-3xl font-bold ${pctColor(promedioPct)}`}>
                      {promedioPct}%
                    </span>
                  )}
                </div>
              )}

              {/* Hora pico */}
              {resumen?.horaPico && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                    Hora del pico máximo
                  </p>
                  <p className="text-white text-sm font-medium">{fmt(resumen.horaPico)}</p>
                </div>
              )}

              {/* Gráfica */}
              {chartData.length > 0 ? (
                <div className="bg-gray-800 rounded-xl p-5">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                    Flujo de personas durante el evento
                  </p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="t" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
                        labelStyle={{ color: '#f9fafb' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="personas"
                        name="Personas"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Sin datos de flujo registrados para este evento.
                </p>
              )}

              {/* Exportar */}
              {resumen && resumen.totalRegistros > 0 && (
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handlePdf}
                    disabled={exporting !== null}
                    className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm rounded-lg py-2 transition-colors"
                  >
                    {exporting === 'pdf' ? 'Generando…' : '📄 Descargar PDF'}
                  </button>
                  <button
                    onClick={handleExcel}
                    disabled={exporting !== null}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm rounded-lg py-2 transition-colors"
                  >
                    {exporting === 'excel' ? 'Generando…' : '📊 Descargar Excel'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  valueClass = '',
}: {
  label: string
  value: string | number
  valueClass?: string
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 text-center">
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-white text-lg font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}
