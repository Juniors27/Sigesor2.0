import { API } from "@/config/api"

export async function getDashboardStats() {
  const response = await fetch(API.dashboard.stats, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Error al obtener las estadisticas")
  }

  return response.json()
}
