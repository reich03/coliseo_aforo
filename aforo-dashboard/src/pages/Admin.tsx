import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  getUsuarios,
  activarUsuario,
  desactivarUsuario,
  registrarUsuario,
} from '../api/usuarioService'
import { useAuthStore } from '../store/authStore'
import Layout from '../components/Layout'
import { UsuarioDto } from '../types'

export default function Admin() {
  const { isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([])
  const [loading, setLoading] = useState(false)

  // Formulario nuevo usuario
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Solo admin puede acceder
  useEffect(() => {
    if (!isAdmin) navigate('/dashboard')
  }, [isAdmin, navigate])

  const cargarUsuarios = () => {
    setLoading(true)
    getUsuarios()
      .then(setUsuarios)
      .catch(() =>
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la lista de usuarios.',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#dc2626',
        })
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargarUsuarios() }, [])

  const handleToggle = async (user: UsuarioDto) => {
    const accion = user.active ? 'desactivar' : 'activar'
    const confirm = await Swal.fire({
      icon: 'question',
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      text: `El usuario "${user.username}" será ${accion}do.`,
      showCancelButton: true,
      confirmButtonText: accion.charAt(0).toUpperCase() + accion.slice(1),
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f9fafb',
      confirmButtonColor: user.active ? '#dc2626' : '#16a34a',
    })
    if (!confirm.isConfirmed) return
    try {
      const updated = user.active
        ? await desactivarUsuario(user.id)
        : await activarUsuario(user.id)
      setUsuarios(prev => prev.map(u => u.id === updated.id ? updated : u))
      Swal.fire({
        icon: 'success',
        title: `Usuario ${updated.active ? 'activado' : 'desactivado'}`,
        text: `"${updated.username}" fue ${updated.active ? 'activado' : 'desactivado'} correctamente.`,
        timer: 2000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#f9fafb',
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el usuario.',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim() || !newEmail.trim() || !newPassword.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios.',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#4f46e5',
      })
      return
    }
    try {
      await registrarUsuario({ username: newUsername.trim(), email: newEmail.trim(), password: newPassword })
      setNewUsername('')
      setNewEmail('')
      setNewPassword('')
      Swal.fire({
        icon: 'success',
        title: 'Operador creado',
        text: `El usuario "${newUsername}" fue registrado correctamente.`,
        timer: 2000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#f9fafb',
      })
      cargarUsuarios()
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: 'No se pudo crear el usuario. El username puede que ya exista.',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  return (
    <Layout title="Panel de Administración" subtitle="Gestión de operadores y accesos">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Lista de usuarios ── */}
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Operadores registrados</h2>
            <button
              onClick={cargarUsuarios}
              className="text-xs text-gray-400 hover:text-white bg-gray-700 px-3 py-1.5 rounded-lg"
            >
              Actualizar
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm animate-pulse">Cargando operadores…</p>
          ) : usuarios.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay usuarios registrados.</p>
          ) : (
            <div className="space-y-3">
              {usuarios.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg px-4 py-3"
                  style={{ background: '#0a120a', border: '1px solid #152015' }}
                >
                  <div>
                    <p className="font-medium text-sm flex items-center gap-2">
                      {user.username}
                      {user.username === 'admin' && (
                        <span className="text-xs bg-indigo-800 text-indigo-200 rounded px-1.5 py-0.5">
                          admin
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                    <p className="text-xs mt-0.5">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 font-medium ${
                          user.active
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                  </div>

                  <button
                    disabled={user.username === 'admin'}
                    onClick={() => handleToggle(user)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      user.username === 'admin'
                        ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                        : user.active
                        ? 'bg-red-900 hover:bg-red-700 text-red-200'
                        : 'bg-green-800 hover:bg-green-700 text-green-200'
                    }`}
                  >
                    {user.active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Crear nuevo operador ── */}
        <div className="rounded-xl p-5 self-start" style={{ background: '#0d150d', border: '1px solid #1a2a1a' }}>
          <h2 className="font-semibold text-lg mb-4">Nuevo operador</h2>

          <form onSubmit={handleCrear} className="space-y-4">

            <div>
              <label className="text-[#3a5a3a] text-[10px] uppercase tracking-widest block mb-2">Username</label>
              <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="operador2" autoComplete="off"
                className="w-full text-sm text-white placeholder-[#2a3a2a] px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500/40"
                style={{ background: '#0a120a', border: '1px solid #1a2a1a' }} />
            </div>
            <div>
              <label className="text-[#3a5a3a] text-[10px] uppercase tracking-widest block mb-2">Email</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@coliseo.co" autoComplete="off"
                className="w-full text-sm text-white placeholder-[#2a3a2a] px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500/40"
                style={{ background: '#0a120a', border: '1px solid #1a2a1a' }} />
            </div>
            <div>
              <label className="text-[#3a5a3a] text-[10px] uppercase tracking-widest block mb-2">Contraseña inicial</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password"
                className="w-full text-sm text-white placeholder-[#2a3a2a] px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500/40"
                style={{ background: '#0a120a', border: '1px solid #1a2a1a' }} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold text-black" style={{ background: '#22c55e' }}>
              Crear operador
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
