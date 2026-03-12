"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { updateUser } from "@/services/users.service"

export default function useEditUserModalForm({ usuario, onUpdated, onClose }) {
  const [formData, setFormData] = useState({
    dni: "",
    apellido_paterno: "",
    apellido_materno: "",
    nombres: "",
    rol: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (usuario) {
      setFormData(usuario)
    }
  }, [usuario])

  return {
    formData,
    errors,
    handleChange: (event) => {
      setFormData((current) => ({
        ...current,
        [event.target.name]: event.target.value,
      }))
    },
    handleSave: async () => {
      setErrors({})
      try {
        const updatedUser = await updateUser(formData.dni, formData)
        toast.success("Usuario actualizado correctamente.")
        onUpdated(updatedUser)
        onClose()
      } catch (error) {
        if (error.details && typeof error.details === "object") {
          setErrors(error.details)
        }
        console.error(error)
        toast.error("Error al actualizar el usuario.")
      }
    },
  }
}
