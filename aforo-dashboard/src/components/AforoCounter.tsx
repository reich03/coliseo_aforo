import { useAforoStore } from '../store/aforoStore'


export default function AforoCounter() {
  const aforo = useAforoStore((s) => s.aforo)

  if (!aforo) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 text-center">
        <p className="text-gray-400">Conectando al sensor...</p>
      </div>
    )
  }

  const colorBarra =
    aforo.estado === 'LLENO'
      ? 'bg-red-600'
      : aforo.estado === 'ALERTA'
      ? 'bg-yellow-400'
      : 'bg-green-500'

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-1">
        Personas dentro
      </h2>
      <div className="flex items-end gap-3 mb-4">
        <span className="text-6xl font-bold tabular-nums">
          {aforo.personasAdentro}
        </span>
        <span className="text-gray-500 text-2xl mb-2">/ {aforo.aforoMaximo}</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`${colorBarra} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(aforo.porcentaje, 100)}%` }}
        />
      </div>
      <p className="text-right text-sm text-gray-400 mt-1">
        {aforo.porcentaje.toFixed(1)}%
      </p>
    </div>
  )
}
