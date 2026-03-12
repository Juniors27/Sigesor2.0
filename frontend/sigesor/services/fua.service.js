import { API } from "@/config/api"

export async function verifyFuaDuplicate({ lote, numero, token }) {
  const params = new URLSearchParams({
    lote,
    numero,
  })

  const response = await fetch(`${API.fua.verifyDuplicate}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("No se pudo verificar el FUA")
  }

  return response.json()
}

export async function createFua(payload, token) {
  const response = await fetch(API.fua.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.detail || "Error en el envio")
  }

  return data
}

export async function getFuaProcedures(params) {
  const searchParams = new URLSearchParams()

  if (params.renipress) searchParams.append("renipress", params.renipress)
  if (params.lote) searchParams.append("lote", params.lote)
  if (params.numero) searchParams.append("numero", params.numero)

  const response = await fetch(`${API.fua.procedures}?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Error al buscar procedimientos")
  }

  return response.json()
}

export async function saveFuaProcedures(payload) {
  const response = await fetch(API.fua.procedures, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("Error al guardar los cambios")
  }

  return response.json().catch(() => null)
}
