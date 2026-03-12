import { API, apiClient } from "@/config/api"

export async function loginUser({ username, password }) {
  const response = await apiClient.post(API.auth.login, {
    dni: username,
    password,
  })

  return response.data
}

export async function getCurrentUser(token) {
  const response = await apiClient.get(API.auth.currentUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
