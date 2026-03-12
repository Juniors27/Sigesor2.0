"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { saveAuthSession } from "@/utils/storage"
import { loginUser } from "@/services/auth.service"

function validateCredentials({ username, password }) {
  if (!username.trim()) {
    return "Por favor, ingresa tu usuario."
  }

  if (!password.trim()) {
    return "Por favor, ingresa tu contrasena."
  }

  return null
}

export default function useLoginForm() {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const updateField = (field) => (event) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateCredentials(formValues)

    if (validationError) {
      toast.warning(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const session = await loginUser(formValues)

      saveAuthSession(session)
      toast.success("Inicio de sesion exitoso.")
      router.push("/dashboard")
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Usuario o contrasena incorrectos.")
      } else {
        toast.error("Ocurrio un error al intentar iniciar sesion.")
      }

      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    username: formValues.username,
    password: formValues.password,
    isSubmitting,
    handleSubmit,
    handleUsernameChange: updateField("username"),
    handlePasswordChange: updateField("password"),
  }
}
