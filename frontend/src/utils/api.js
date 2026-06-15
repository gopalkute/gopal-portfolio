import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30s — Render free tier cold start can take ~60s, but we handle it in UI
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 — clear stale token
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken')
    }
    return Promise.reject(err)
  }
)

export default API

// Utility: ping backend and measure response time
// Used to detect cold start and show "waking up" message
export async function checkBackendStatus() {
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
    .replace('/api', '')
  try {
    const start = Date.now()
    await axios.get(`${baseUrl}/ping`, { timeout: 65000 })
    return { ok: true, ms: Date.now() - start }
  } catch {
    return { ok: false, ms: null }
  }
}
