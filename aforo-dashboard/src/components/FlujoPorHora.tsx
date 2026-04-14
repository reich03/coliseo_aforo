import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { RegistroHistorico } from '../types'

interface Props {
  datos: RegistroHistorico[]
}


export default function FlujoPorHora({ datos }: Props) {
  const porHora: Record<string, { hora: string; personas: number }> = {}

  datos.forEach((r) => {
    const dt = new Date(r.timestamp)
    const hora = `${String(dt.getHours()).padStart(2, '0')}:00`
    if (!porHora[hora] || r.personasAdentro > porHora[hora].personas) {
      porHora[hora] = { hora, personas: r.personasAdentro }
    }
  })

  const chartData = Object.values(porHora).sort((a, b) =>
    a.hora.localeCompare(b.hora)
  )

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-4">
        Pico por hora
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          Sin datos de historial
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hora" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              labelStyle={{ color: '#f9fafb' }}
            />
            <Legend />
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
      )}
    </div>
  )
}
