// API Base URL configuration
// Em desenvolvimento: fallback para localhost:8000
// Em produção: usa NEXT_PUBLIC_API_BASE (obrigatório)
const getApiBase = () => {
  const base = process.env.NEXT_PUBLIC_API_BASE
  if (base) {
    // Remove trailing slash
    return base.replace(/\/$/, '')
  }
  // Fallback para desenvolvimento local
  if (process.env.NODE_ENV === 'development') {
    return 'http://127.0.0.1:8000'
  }
  // Em produção sem API_BASE definido, usa URL relativa (proxy)
  return ''
}

const API = getApiBase()

export async function apiFetch(endpoint) {
  const url = `${API}/api${endpoint}`

  const res = await fetch(url, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

export function makeApiUrl(path) {
  return `${API}/api${path}`
}