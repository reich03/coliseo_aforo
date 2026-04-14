import { useAforoStore } from '../store/aforoStore'


export default function AlertaBanner() {
  const alertas = useAforoStore((s) => s.alertas)
  const clearAlertas = useAforoStore((s) => s.clearAlertas)

  if (alertas.length === 0) return null

  const ultima = alertas[0]

  return (
    <div className="bg-red-700 border border-red-500 rounded-xl px-5 py-4 flex items-center justify-between">
      <div>
        <p className="font-bold text-white">{ultima.tipo}</p>
        <p className="text-red-200 text-sm">{ultima.mensaje}</p>
      </div>
      <button
        onClick={clearAlertas}
        className="ml-4 text-red-200 hover:text-white text-xl leading-none"
        aria-label="Cerrar alerta"
      >
        ✕
      </button>
    </div>
  )
}
