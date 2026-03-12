"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { createUser } from "@/services/users.service"

const INITIAL_FORM_STATE = {
  dni: "",
  apellido_paterno: "",
  apellido_materno: "",
  nombres: "",
  rol: "responsable_pdd",
  password: "",
}

export default function useNuevoUsuarioForm() {
  const router = useRouter()
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "dni" ? { password: value } : {}),
    }))

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.dni || formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener 8 digitos numericos"
    }

    if (!formData.apellido_paterno) newErrors.apellido_paterno = "El apellido paterno es obligatorio"
    if (!formData.nombres) newErrors.nombres = "El nombre es obligatorio"
    if (!formData.rol) newErrors.rol = "El rol es obligatorio"
    if (!formData.password) newErrors.password = "La contrasena es obligatoria"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await createUser(formData)
      toast.success("Registro exitoso", {
        description: "El usuario fue registrado correctamente",
      })
      setFormData(INITIAL_FORM_STATE)
    } catch (error) {
      console.error("Error inesperado:", error)
      toast.error(error.message)
    }
  }

  return {
    router,
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleCancel: () => {
      router.push("/dashboard/configurar-usuario")
    },
  }
}
