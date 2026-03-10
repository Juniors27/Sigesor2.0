"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { toast } from "sonner"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones de campos vacíos
    if (!username.trim()) {
      toast.warning("Por favor, ingresa tu usuario.")
      return
    }

    if (!password.trim()) {
      toast.warning("Por favor, ingresa tu contraseña.")
      return
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/usuario/login/", {
        dni: username,
        password,
      },{
    headers: {
      "Content-Type": "application/json",
    },
  })

      const { access, rol, nombres, apellido_paterno } = response.data

      localStorage.setItem("token", access)
      localStorage.setItem("rol", rol)
      localStorage.setItem("nombre", `${nombres} ${apellido_paterno}`)

      toast.success("¡Inicio de sesión exitoso!")
      router.push("/dashboard")
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Usuario o contraseña incorrectos.")
      } else {
        toast.error("Ocurrió un error al intentar iniciar sesión.")
      }
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1f36] relative overflow-hidden">
      {/* Fondo con ondas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 right-0">
          <Image src="/images/wave-bg.png" alt="Background" width={1920} height={1080} className="w-full" />
        </div>
      </div>

      <div className="z-10 bg-[#121212] p-8 rounded-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-30 h-15 bg-blue-600 rounded flex items-center justify-center text-white text-2xl font-bold mb-4">
            SIGESOR
          </div>
          <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
          <p className="text-gray-400">Bienvenido</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Usuario"
              className="pl-10 w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Contraseña"
              className="pl-10 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition-colors uppercase"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  )
}
