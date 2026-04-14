import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { getEventos, crearEvento } from '../api/eventoService'
import EventoCard from '../components/EventoCard'
import Layout from '../components/Layout'
import { Evento } from '../types'

const SWL = { background: '#0a100a', color: '#f0f0f0' }

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [nombre, setNombre] = useState('')
  const [aforoMax, setAforoMax] = useState(1000)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const cargar = () => getEventos().then(setEventos).catch(() => {})
  useEffect(() => { cargar() }, [])

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'El nombre del evento es obligatorio.', ...SWL, confirmButtonColor: '#22c55e' })
      return
    }
    if (aforoMax < 1) {
      Swal.fire({ icon: 'warning', title: 'Aforo inválido', text: 'El aforo máximo debe ser mayor a 0.', ...SWL, confirmButtonColor: '#22c55e' })
      return
    }
    try {
      await crearEvento(nombre, aforoMax)
      setNombre(''); setAforoMax(1000); setShowForm(false)
      Swal.fire({ icon: 'success', title: 'Evento creado', text: `"${nombre}" fue registrado correctamente.`, timer: 2000, showConfirmButton: false, ...SWL })
      cargar()
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el evento.', ...SWL, confirmButtonColor: '#dc2626' })
    }
  }

  const filtered = eventos.filter((e) => e.nombre.toLowerCase().includes(search.toLowerCase()))

  const headerRight = (
    <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold text-black transition-all" style={{ background: '#22c55e' }}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2.5} strokeLinecap="round"/></svg>
      {showForm ? 'Cerrar' : 'Nuevo Evento'}
    </button>
  )

  return (
    <Layout title="Gestión de Eventos" subtitle="Panel de Control de Aforo" headerRight={headerRight}>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Nuevo Evento</span>
          </div>
          <form onSubmit={handleCrear} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-[#3a5a3a] text-[10px] uppercase tracking-widest block mb-2">Nombre del evento</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Concierto Fonseca 2026"
                className="w-full text-sm text-white placeholder-[#2a3a2a] px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500/40"
                style={{ background: '#0a120a', border: '1px solid #1a2a1a' }} />
            </div>
            <div>
              <label className="text-[#3a5a3a] text-[10px] uppercase tracking-widest block mb-2">Aforo máximo</label>
              <input type="number" min={1} value={aforoMax} onChange={(e) => setAforoMax(Number(e.target.value))}
                className="w-full text-sm text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500/40"
                style={{ background: '#0a120a', border: '1px solid #1a2a1a' }} />
            </div>
            <button type="submit" className="py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold text-black" style={{ background: '#22c55e' }}>
              Crear evento
            </button>
          </form>
        </div>
      )}

      {/* Search + list header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[9px] uppercase tracking-widest text-[#2a3a2a]">
          Listado de Eventos Proyectados · <span className="text-[#3a5a3a]">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2a3a2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar evento..."
              className="text-xs text-white placeholder-[#2a3a2a] pl-9 pr-4 py-2 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-green-500/30"
              style={{ background: '#0d150d', border: '1px solid #1a2a1a' }} />
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 && (
          <p className="text-[#2a3a2a] text-xs uppercase tracking-widest col-span-full text-center py-16">
            No hay eventos registrados
          </p>
        )}
        {filtered.map((ev) => (
          <EventoCard key={ev.id} evento={ev} onRefresh={cargar} />
        ))}
      </div>
    </Layout>
  )
}
