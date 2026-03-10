"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, User, LogOut, Key } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import ModalCambiarContrasena from "@/components/CambiarContrasena"

export default function Header({ toggleSidebar }) {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)
  const [nombre, setNombre] = useState("")
  const [rol, setRol] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)

  //Obtener nombre y rol
  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre")
    const storedRol = localStorage.getItem("rol")

    if (storedNombre) setNombre(storedNombre)
    if (storedRol) setRol(storedRol)
  }, [])

  const formatRol = (rol) => {
    if (!rol) return ""
    return rol
      .split("_")                // separa por guiones bajos
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))  // capitaliza cada palabra
      .join(" ")                 // une con espacio
  }

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  //Cerrar sesion
  const handleLogout = () => {
    // Eliminar datos del usuario del localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("rol")
    localStorage.removeItem("nombre")

    // Mostrar notificación de éxito (opcional, si usas sonner)
    toast.success("Sesión cerrada correctamente.")

    // Redirigir al login
    router.push("/login")
  }

  //cambiar contraseña
  /* const handleChangePassword = async () => {
     const nuevaPassword = prompt("Ingresa tu nueva contraseña:")
     if (!nuevaPassword || nuevaPassword.trim().length < 6) {
       toast.warning("La contraseña debe tener al menos 6 caracteres.")
       return
     }
 
     try {
       const token = localStorage.getItem("token")
 
       const response = await axios.post(
         "http://127.0.0.1:8000/api/usuarios/cambiar-contrasena/",
         { nueva_password: nuevaPassword },
         {
           headers: {
             Authorization: `Bearer ${token}`
           }
         }
       )
 
       toast.success("Contraseña cambiada con éxito.")
     } catch (err) {
       console.error(err)
       toast.error("Error al cambiar la contraseña.")
     }
   }*/

  const handleChangePassword = () => {
    setMostrarModal(true)
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center px-4">
      <button onClick={toggleSidebar} className="lg:hidden mr-2 p-2 rounded-md hover:bg-gray-800">
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center">
        <span className="text-gray-400 mr-2">PDD:</span>
        <span className="bg-blue-600 text-white px-2 py-0.5 text-xs rounded">HDRT</span>
      </div>

      <div className="mx-auto text-xl font-semibold">SIGESOR</div>

      <div className="flex items-center">
        <span className="text-gray-300 mr-2">Oficina de Seguros</span>
        <div className="relative" ref={userMenuRef}>
          <div
            className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium cursor-pointer"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User className="h-5 w-5" />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-700">
                <p className="text-sm font-medium">{nombre || "Usuario"}</p>
                <p className="text-xs text-gray-400">{rol ? formatRol(rol) : "Rol"}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={handleChangePassword}
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700 rounded"
                >
                  <Key className="h-4 w-4 mr-2" />
                  <span>Cambiar contraseña</span>
                </button>
                {mostrarModal && (
                  <ModalCambiarContrasena onClose={() => setMostrarModal(false)} />
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700 rounded text-red-400 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
