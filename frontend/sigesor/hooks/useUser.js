"use client"

import { useEffect, useState } from "react"

import { getAuthToken } from "@/utils/storage"
import { getCurrentUser } from "@/services/auth.service"

export default function useUser() {
  const [rol, setRol] = useState(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = getAuthToken()

      if (!token) {
        return
      }

      try {
        const data = await getCurrentUser(token)
        setRol(data.rol)
      } catch (error) {
        console.error("Error al obtener el rol del usuario", error.message)
      }
    }

    fetchUserRole()
  }, [])

  return { rol }
}
