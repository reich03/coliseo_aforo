import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface Props {
  children: ReactNode
  /** Top-right header content (e.g. active event pill + user) */
  headerRight?: ReactNode
  title?: string
  subtitle?: string
}

export default function Layout({ children, headerRight, title, subtitle }: Props) {
  return (
    <div className="flex min-h-screen bg-[#070d07] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        {(title || headerRight) && (
          <header className="flex items-center justify-between px-8 py-4 border-b border-[#152015] shrink-0">
            <div>
              {title && <h1 className="text-white text-lg font-bold tracking-wide">{title}</h1>}
              {subtitle && <p className="text-[#4a6a4a] text-xs mt-0.5">{subtitle}</p>}
            </div>
            {headerRight && <div className="flex items-center gap-3">{headerRight}</div>}
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto p-7">{children}</main>

        {/* Footer */}
        <footer className="shrink-0 border-t border-[#152015] px-8 py-3 flex items-center justify-between">
          <p className="text-[#2a3a2a] text-[10px] uppercase tracking-widest">
            Sistema UNILLANOS · Coliseo Álvaro Mesa Amaya
          </p>
         
        </footer>
      </div>
    </div>
  )
}
