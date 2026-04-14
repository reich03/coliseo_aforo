import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface NavbarProps {
  title?: string
}

export default function Navbar({ title = 'Coliseo Álvaro Mesa Amaya' }: NavbarProps) {
  const { username, isAdmin, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500 text-sm">Panel de Control de Aforo</p>
      </div>

      <nav className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/eventos"
          className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Eventos
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="bg-indigo-700 hover:bg-indigo-600 text-sm px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Admin
          </Link>
        )}

        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-700">
          <span className="text-sm text-gray-400">
            {username}
            {isAdmin && (
              <span className="ml-1 text-xs bg-indigo-800 text-indigo-200 rounded px-1.5 py-0.5">
                admin
              </span>
            )}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-900 hover:bg-red-700 text-red-200 text-sm px-3 py-2 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  )
}
