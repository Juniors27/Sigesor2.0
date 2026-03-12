import axios from "axios"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000"

export const API = {
  base: API_BASE_URL,

  auth: {
    login: `${API_BASE_URL}/api/usuario/login/`,
    currentUser: `${API_BASE_URL}/api/usuario/actual/`,
  },

  dashboard: {
    stats: `${API_BASE_URL}/api/dashboard/stats/`,
  },

  fua: {
    verifyDuplicate: `${API_BASE_URL}/api/fua/verificar-duplicado/`,
    register: `${API_BASE_URL}/api/fua/registro/`,
    procedures: `${API_BASE_URL}/api/fua/procedimientos/`,
  },

  trays: {
    observados: {
      root: `${API_BASE_URL}/api/bandeja/observados/`,
      availableDates: `${API_BASE_URL}/api/bandeja/observados/fechas-disponibles/`,
    },
    extemporaneos: {
      root: `${API_BASE_URL}/api/bandeja/extemporaneos/`,
      availableDates: `${API_BASE_URL}/api/bandeja/extemporaneos/fechas-disponibles/`,
      editFua: `${API_BASE_URL}/api/bandeja/extemporaneos/editar_fua/`,
    },
  },

  users: {
    root: `${API_BASE_URL}/api/usuarios/`,
    create: `${API_BASE_URL}/api/usuarios/crear/`,
    changePassword: `${API_BASE_URL}/api/usuarios/cambiar-contrasena/`,
    resetPassword: `${API_BASE_URL}/api/usuarios/`,
    edit: `${API_BASE_URL}/api/usuarios/`,
    delete: `${API_BASE_URL}/api/usuarios/`,
  },
}

export const apiClient = axios.create({
  baseURL: API.base,
  headers: {
    "Content-Type": "application/json",
  },
})

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${API.base}${normalizedPath}`
}
