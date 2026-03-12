import axios from "axios"

import { API } from "@/config/api"
import { getAuthToken } from "@/utils/storage"

export async function getUsers() {
  const response = await fetch(API.users.root)

  if (!response.ok) {
    throw new Error("No se pudieron cargar los usuarios.")
  }

  return response.json()
}

export async function createUser(payload) {
  const token = getAuthToken()
  const response = await fetch(API.users.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(async () => {
    const text = await response.text()
    throw new Error(text || "Respuesta no valida del servidor.")
  })

  if (!response.ok) {
    throw new Error(data.detail || "Error en la peticion. DNI duplicado.")
  }

  return data
}

export async function updateUser(dni, payload) {
  const response = await fetch(`${API.users.edit}${dni}/editar/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error("Error al actualizar el usuario")
    error.details = data
    throw error
  }

  return data
}

export async function resetUserPassword(dni) {
  const response = await fetch(`${API.users.resetPassword}${dni}/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Error al resetear la contrasena.")
  }

  return data
}

export async function deleteUser(dni) {
  const response = await fetch(`${API.users.delete}${dni}/eliminar/`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }
}

export async function changeUserPassword(payload, token) {
  await axios.post(API.users.changePassword, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
