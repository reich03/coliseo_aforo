import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Por favor ingresa tu usuario y contraseña.', background: '#0a100a', color: '#f0f0f0', confirmButtonColor: '#22c55e' })
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('/usuarios/login', { username, password })
      login(res.data.token, res.data.username, res.data.email)
      await Swal.fire({ icon: 'success', title: `Bienvenido, ${res.data.username}`, timer: 1200, showConfirmButton: false, background: '#0a100a', color: '#f0f0f0' })
      navigate('/dashboard')
    } catch {
      Swal.fire({ icon: 'error', title: 'Acceso denegado', text: 'Usuario o contraseña incorrectos.', background: '#0a100a', color: '#f0f0f0', confirmButtonColor: '#dc2626' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 30%, #0d1f0d 0%, #050a05 60%, #020602 100%)' }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative w-full max-w-[380px]">
        <div className="rounded-2xl px-10 py-10" style={{ background: 'rgba(10,18,10,0.92)', border: '1px solid #1c301c', boxShadow: '0 0 60px rgba(34,197,94,0.06),0 24px 48px rgba(0,0,0,0.6)' }}>
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#0d2010', border: '1px solid #1c401c' }}>
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-white text-base font-bold tracking-[0.15em] uppercase">Coliseo Álvaro Mesa Amaya</h1>
            <p className="text-[#3a5a3a] text-[10px] uppercase tracking-[0.25em] mt-1">Control Center Access</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[#6b8a6b] text-[10px] uppercase tracking-[0.15em] block mb-2">Usuario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5a3a]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth={2} strokeLinecap="round"/></svg></span>
                <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" placeholder="Ingrese su usuario" className="w-full pl-9 pr-4 py-3 text-sm text-white placeholder-[#2a3a2a] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500/40" style={{ background: '#0d180d', border: '1px solid #1c2e1c' }} />
              </div>
            </div>
            <div>
              <label className="text-[#6b8a6b] text-[10px] uppercase tracking-[0.15em] block mb-2">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5a3a]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={2}/><path d="M8 11V7a4 4 0 018 0v4" strokeWidth={2} strokeLinecap="round"/></svg></span>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" className="w-full pl-9 pr-10 py-3 text-sm text-white placeholder-[#2a3a2a] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500/40" style={{ background: '#0d180d', border: '1px solid #1c2e1c' }} />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a5a3a] hover:text-green-400 transition-colors">
                  {showPwd ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeWidth={2} strokeLinecap="round"/></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2}/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={2}/></svg>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold tracking-wide uppercase transition-all disabled:opacity-60" style={{ background: loading ? '#166534' : '#22c55e', color: '#000' }}>
              {loading ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Verificando...</>) : (<>Iniciar Sesión<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2} strokeLinecap="round"/></svg></>)}
            </button>
          </form>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              Acceso restringido a personal autorizado
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
