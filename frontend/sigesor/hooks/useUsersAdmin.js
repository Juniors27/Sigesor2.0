"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { deleteUser, getUsers, resetUserPassword } from "@/services/users.service"

export default function useUsersAdmin() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [usuarios, setUsuarios] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [showResetModal, setShowResetModal] = useState(false)
  const [userToReset, setUserToReset] = useState(null)

  useEffect(() => {
    getUsers()
      .then(setUsuarios)
      .catch((error) => {
        console.error("Error al cargar usuarios:", error)
        toast.error(error.message)
      })
  }, [])

  useEffect(() => {
    if (usuarioSeleccionado) {
      setModalOpen(true)
    }
  }, [usuarioSeleccionado])

  const filteredUsuarios = useMemo(
    () =>
      usuarios.filter(
        (usuario) =>
          usuario.dni.includes(searchTerm) ||
          usuario.apellido_paterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.apellido_materno.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, usuarios]
  )

  return {
    router,
    searchTerm,
    setSearchTerm,
    usuarios,
    modalOpen,
    setModalOpen,
    usuarioSeleccionado,
    showModal,
    setShowModal,
    userToDelete,
    showResetModal,
    setShowResetModal,
    userToReset,
    filteredUsuarios,
    handleEdit: (dni) => {
      setUsuarioSeleccionado(usuarios.find((user) => user.dni === dni))
    },
    handleUsuarioActualizado: (updatedUser) => {
      setUsuarios((current) => current.map((user) => (user.dni === updatedUser.dni ? updatedUser : user)))
    },
    handleReset: async (dni) => {
      try {
        const data = await resetUserPassword(dni)
        toast.success(data.detail)
        setShowResetModal(false)
        setUserToReset(null)
      } catch (error) {
        console.error("Error al resetear contrasena:", error)
        toast.error(error.message)
      }
    },
    handleDeleteUser: (dni) => {
      setUserToDelete(dni)
      setShowModal(true)
    },
    confirmDelete: async () => {
      const dni = userToDelete

      try {
        await deleteUser(dni)
        setUsuarios((current) => current.filter((usuario) => usuario.dni !== dni))
        toast.success("Usuario eliminado correctamente")
      } catch (error) {
        toast.error(`Error al eliminar: ${error.message}`)
        console.error("Error deleting user:", error)
      } finally {
        setShowModal(false)
        setUserToDelete(null)
      }
    },
    cancelDelete: () => {
      setShowModal(false)
      setUserToDelete(null)
    },
    handleNewUser: () => {
      router.push("/dashboard/configurar-usuario/nuevo")
    },
    setUserToReset,
  }
}
