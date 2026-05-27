// URL base del backend, leída desde el archivo .env
// En desarrollo: http://localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_BACK_SBM_BASE_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('sbm_auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Manejo de respuestas 401 (token expirado / no autorizado) ─────────────────
// Si el backend responde con 401, limpiamos el token del localStorage y
// redirigimos al login para que el usuario vuelva a autenticarse.
const handleUnauthorized = () => {
  localStorage.removeItem('sbm_auth_token')
  window.location.href = '/login'
}

// ── Extractor de mensajes de error ────────────────────────────────────────────
// El backend Spring Boot puede devolver dos formatos de error:
//
//   1. Error genérico:
//      { "message": "No encontrado" }
//
//   2. Errores de validación (múltiples campos):
//      { "errors": [{ "field": "email", "message": "El email es obligatorio" }] }
//
// Esta función extrae el mensaje más útil de cualquiera de los dos formatos.
const getErrorMessage = async (response) => {
  try {
    const body = await response.json()

    // Caso 2: array de errores de validación → los unimos en un solo string
    if (Array.isArray(body.errors) && body.errors.length > 0) {
      return body.errors.map(e => `${e.field}: ${e.message}`).join(' | ')
    }

    // Caso 1: mensaje simple
    return body.message || body.error || body.detail || `Error ${response.status}`
  } catch {
    // Si la respuesta no es JSON, usamos el texto plano
    return response.statusText || `Error ${response.status}`
  }
}

// ── Cliente HTTP ──────────────────────────────────────────────────────────────
// Centraliza todas las llamadas al backend.
// Cada método lanza un Error con el mensaje extraído si la respuesta no es OK
// (status >= 400), para que el hook que lo llama pueda capturarlo con catch.
const apiClient = {

  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...getAuthHeaders(),
      },
    })
    if (response.status === 401) return handleUnauthorized()
    if (!response.ok) throw new Error(await getErrorMessage(response))
    return response.json()
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(await getErrorMessage(response))
    return response.json()
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })
    if (response.status === 401) return handleUnauthorized()
    if (!response.ok) throw new Error(await getErrorMessage(response))
    return response.json()
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    })
    if (response.status === 401) return handleUnauthorized()
    if (!response.ok) throw new Error(await getErrorMessage(response))
    return response.ok
  },
}

export default apiClient
