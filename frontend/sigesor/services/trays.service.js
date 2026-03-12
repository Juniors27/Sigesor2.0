import { API } from "@/config/api"

const FILTER_TYPE_MONTH = "A\u00f1o y mes del Formato"
const FILTER_TYPE_DATE = "Fecha de Atencion"
const FILTER_TYPE_FUA = "N\u00b0 de FUA"

function getTrayConfig(type) {
  return API.trays[type]
}

export async function getTrayAvailableDates(type) {
  const response = await fetch(getTrayConfig(type).availableDates)

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export async function getTrayItems(type, filters = {}) {
  const params = new URLSearchParams()

  if (filters.filterType === FILTER_TYPE_MONTH && filters.filterValue) {
    params.append("mes_anio", filters.filterValue)
  }

  if (filters.filterType === FILTER_TYPE_DATE && filters.dateRange?.startDate && filters.dateRange?.endDate) {
    params.append("fecha_inicio", filters.dateRange.startDate.toISOString().split("T")[0])
    params.append("fecha_fin", filters.dateRange.endDate.toISOString().split("T")[0])
  }

  if (filters.filterType === FILTER_TYPE_FUA) {
    if (filters.fuaRenipress) params.append("renipress", filters.fuaRenipress)
    if (filters.fuaLote) params.append("lote", filters.fuaLote)
    if (filters.fuaNumero) params.append("numero", filters.fuaNumero)
  }

  const query = params.toString()
  const response = await fetch(`${getTrayConfig(type).root}${query ? `?${query}` : ""}`)

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteTrayItem(type, id) {
  const response = await fetch(`${getTrayConfig(type).root}${id}/`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }
}

export async function updateExtemporaneoFua(id, payload, token) {
  const response = await fetch(`${API.trays.extemporaneos.editFua}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.detail || "Error al actualizar el FUA")
  }

  return response.json()
}
