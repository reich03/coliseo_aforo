import { create } from 'zustand'

interface AuthState {
  token: string | null
  username: string | null
  email: string | null
  isAdmin: boolean
  login: (token: string, username: string, email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  username: localStorage.getItem('col_username'),
  email: localStorage.getItem('col_email'),
  isAdmin: localStorage.getItem('col_username') === 'admin',

  login: (token, username, email) => {
    localStorage.setItem('token', token)
    localStorage.setItem('col_username', username)
    localStorage.setItem('col_email', email)
    set({ token, username, email, isAdmin: username === 'admin' })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('col_username')
    localStorage.removeItem('col_email')
    set({ token: null, username: null, email: null, isAdmin: false })
  },
}))
