import { downloadPdf, downloadExcel } from '../api/reporteService'

interface Props {
  eventoId: string
}

export default function ReportePanel({ eventoId }: Props) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-4">
        Exportar reporte
      </h2>
      <div className="flex gap-3">
        <button
          onClick={() => downloadPdf(eventoId)}
          className="flex-1 bg-red-700 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium"
        >
          PDF
        </button>
        <button
          onClick={() => downloadExcel(eventoId)}
          className="flex-1 bg-green-700 hover:bg-green-600 text-white rounded-xl py-2.5 text-sm font-medium"
        >
          Excel
        </button>
      </div>
    </div>
  )
}
