"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, User, LogOut, Key } from "lucide-react"
import { toast } from "sonner"
import ModalCambiarContrasena from "@/components/CambiarContrasena"

export default function Header({ toggleSidebar }) {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)
  const [nombre, setNombre] = useState("")
  const [rol, setRol] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre")
    const storedRol = localStorage.getItem("rol")

    if (storedNombre) setNombre(storedNombre)
    if (storedRol) setRol(storedRol)
  }, [])

  const formatRol = (rol) => {
    if (!rol) return ""
    return rol
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  }

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

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("rol")
    localStorage.removeItem("nombre")

    toast.success("Sesion cerrada correctamente.")
    router.push("/login")
  }

  const handleChangePassword = () => {
    setMostrarModal(true)
  }

  return (
    <header className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(10,18,31,0.98),rgba(12,24,40,0.94))] px-4 py-3 shadow-[0_10px_35px_rgba(2,6,23,0.25)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-xl border border-white/10 bg-slate-900/70 p-2.5 text-slate-200 transition hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(37,99,235,0.22),rgba(6,182,212,0.16))] px-4 py-2 text-lg font-semibold tracking-[0.22em] text-white shadow-lg shadow-slate-950/20">
            SIGESOR
          </h1>
        </div>

        <div className="hidden lg:flex items-center rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">PDD</span>
          <span className="mx-2 text-slate-600">:</span>
          <span className="text-sm font-semibold text-white">HDRT</span>
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-left transition hover:bg-slate-800/90"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="hidden text-right sm:block">
              <p className="max-w-[180px] truncate text-sm font-medium text-white">{nombre || "Usuario"}</p>
              <p className="max-w-[180px] truncate text-xs text-slate-400">{rol ? formatRol(rol) : "Rol"}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-950/30">
              <User className="h-5 w-5" />
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div className="border-b border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{nombre || "Usuario"}</p>
                <p className="mt-1 text-xs text-slate-400">{rol ? formatRol(rol) : "Rol"}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={handleChangePassword}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  <Key className="h-4 w-4" />
                  <span>Cambiar contrasena</span>
                </button>
                {mostrarModal && (
                  <ModalCambiarContrasena onClose={() => setMostrarModal(false)} />
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
