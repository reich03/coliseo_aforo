import axios from 'axios'

const http = axios.create()

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('col_username')
      localStorage.removeItem('col_email')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default http
