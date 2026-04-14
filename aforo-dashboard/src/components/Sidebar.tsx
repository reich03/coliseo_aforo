import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const NAV = [
  {
    label: 'Inicio',
    to: '/dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} />
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} />
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} />
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} />
      </svg>
    ),
  },
  {
    label: 'Eventos',
    to: '/eventos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
        <path d="M16 2v4M8 2v4M3 10h18" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Reportes',
    to: '/reportes',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 17v-6m4 6v-3m4 3v-9M3 20h18" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { username, isAdmin, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-[200px] min-h-screen bg-[#080e08] border-r border-[#152015] flex flex-col shrink-0">
      <div className="px-5 pt-6 pb-4 border-b border-[#152015]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded bg-green-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
          </div>
          <span className="text-white text-xs font-bold leading-tight">UNILLANOS OS</span>
        </div>
        <div>
          <p className="text-white text-xs font-semibold">Centro de Control</p>
          <p className="text-green-500 text-[10px] uppercase tracking-widest font-medium">UNILLANOS</p>
        </div>
      </div>

      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        {NAV.map((item) => {
          const active =
            item.to === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all
                ${active
                  ? 'bg-green-500/10 text-green-400 border-l-2 border-green-500'
                  : 'text-[#6b8a6b] hover:text-green-300 hover:bg-white/5 border-l-2 border-transparent'
                }`}
            >
              {item.icon}
              <span className="uppercase tracking-wider">{item.label}</span>
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <p className="text-[#2a3a2a] text-[10px] uppercase tracking-widest px-3 pt-3 pb-1">Herramientas</p>
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all
                ${location.pathname === '/admin'
                  ? 'bg-green-500/10 text-green-400 border-l-2 border-green-500'
                  : 'text-[#6b8a6b] hover:text-green-300 hover:bg-white/5 border-l-2 border-transparent'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <span className="uppercase tracking-wider">Administración</span>
            </Link>
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-1 border-t border-[#152015] pt-4">
        <button
          onClick={() => navigate('/eventos')}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-md py-2.5 uppercase tracking-wider transition-colors mb-3"
        >
          <span>+</span> Crear Evento
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-[#4a6a4a] hover:text-green-300 text-xs rounded-md hover:bg-white/5 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth={1.5} />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={1.5} />
          </svg>
          <span className="uppercase tracking-wider">Configuración</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-[#4a6a4a] hover:text-red-400 text-xs rounded-md hover:bg-white/5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <span className="uppercase tracking-wider">Soporte</span>
        </button>

        <div className="px-3 pt-2">
          <p className="text-[#2a3a2a] text-[9px] uppercase tracking-widest">{username}</p>
        </div>
      </div>
    </aside>
  )
}
