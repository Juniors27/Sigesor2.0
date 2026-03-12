"use client"

import { useState } from "react"
import { toast } from "sonner"

import { createUser } from "@/services/users.service"

const INITIAL_FORM_STATE = {
  dni: "",
  apellido_paterno: "",
  apellido_materno: "",
  nombres: "",
  rol: "",
  password: "",
}

export default function useCrearUsuarioForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await createUser(formData)
      toast.success("Usuario registrado correctamente")
      setFormData(INITIAL_FORM_STATE)
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      toast.error(error.message || "Error al registrar usuario")
    }
  }

  return {
    formData,
    handleChange,
    handleSubmit,
  }
}
