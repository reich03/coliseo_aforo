import { useAforoStore } from '../store/aforoStore'
import { EstadoAforo } from '../types'

const CONFIG: Record<EstadoAforo, { verde: boolean; amarillo: boolean; rojo: boolean; label: string }> = {
  LIBRE: { verde: true, amarillo: false, rojo: false, label: 'Aforo libre' },
  ALERTA: { verde: false, amarillo: true, rojo: false, label: 'Casi lleno' },
  LLENO: { verde: false, amarillo: false, rojo: true, label: 'Aforo máximo' },
}


export default function SemaforoVisual() {
  const estado = useAforoStore((s) => s.aforo?.estado ?? 'LIBRE')
  const cfg = CONFIG[estado]

  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4">
      <h2 className="text-gray-400 text-sm uppercase tracking-widest">Semáforo</h2>

      <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-4 w-20">
        <div
          className={`w-12 h-12 rounded-full mx-auto transition-all duration-300 ${
            cfg.verde
              ? 'bg-green-500 shadow-[0_0_20px_6px_rgba(34,197,94,0.7)]'
              : 'bg-green-900 opacity-40'
          }`}
        />
        <div
          className={`w-12 h-12 rounded-full mx-auto transition-all duration-300 ${
            cfg.amarillo
              ? 'bg-yellow-400 shadow-[0_0_20px_6px_rgba(250,204,21,0.7)]'
              : 'bg-yellow-900 opacity-40'
          }`}
        />
        <div
          className={`w-12 h-12 rounded-full mx-auto transition-all duration-300 ${
            cfg.rojo
              ? 'bg-red-600 shadow-[0_0_20px_6px_rgba(220,38,38,0.7)]'
              : 'bg-red-900 opacity-40'
          }`}
        />
      </div>

      <span
        className={`text-sm font-semibold ${
          estado === 'LIBRE'
            ? 'text-green-400'
            : estado === 'ALERTA'
            ? 'text-yellow-400'
            : 'text-red-500'
        }`}
      >
        {cfg.label}
      </span>
    </div>
  )
}
