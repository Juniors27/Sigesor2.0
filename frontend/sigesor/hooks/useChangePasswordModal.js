"use client"

import { useState } from "react"
import { toast } from "sonner"

import { changeUserPassword } from "@/services/users.service"
import { getAuthToken } from "@/utils/storage"

export default function useChangePasswordModal({ onClose }) {
  const [actual, setActual] = useState("")
  const [nueva, setNueva] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!actual || !nueva) {
      toast.warning("Todos los campos son obligatorios.")
      return
    }

    if (nueva.length < 6) {
      toast.warning("La nueva contrasena debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)

    try {
      await changeUserPassword(
        {
          actual_password: actual,
          nueva_password: nueva,
        },
        getAuthToken()
      )

      toast.success("Contrasena cambiada con exito.")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.status === 400 ? "La contrasena actual es incorrecta." : "Error al cambiar la contrasena.")
    } finally {
      setLoading(false)
    }
  }

  return {
    actual,
    setActual,
    nueva,
    setNueva,
    loading,
    handleSubmit,
  }
}
