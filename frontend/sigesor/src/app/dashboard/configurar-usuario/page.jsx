"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, RefreshCw, Trash2, UserPlus, Search } from "lucide-react"
import { toast } from "sonner"
import EditUserModal from "@/components/EditUserModal"
import ConfirmModal from "@/components/ComfirmModal"
import ModalResetPassword from "@/components/ModalResetPassword"

export default function ConfigurarUsuarioPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [usuarios, setUsuarios] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

  //modal de confirmacion delete usuario
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  //modal de resetear contraseña
  const [showResetModal, setShowResetModal] = useState(false);
  const [userToReset, setUserToReset] = useState(null);


  // Obtener usuarios desde la API al cargar
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/usuarios/")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => {
        console.error("Error al cargar usuarios:", err)
        toast.error("No se pudieron cargar los usuarios.")
      })
  }, [])

  // Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.dni.includes(searchTerm) ||
      usuario.apellido_paterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido_materno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  //editar usuario
  useEffect(() => {
    if (usuarioSeleccionado) {
      setModalOpen(true)
      console.log("setModalOpen:", modalOpen)
    }
  }, [usuarioSeleccionado])

  const handleEdit = (dni) => {
    const usuario = usuarios.find((u) => u.dni === dni)
    setUsuarioSeleccionado(usuario)
  }

  const handleUsuarioActualizado = (updatedUser) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.dni === updatedUser.dni ? updatedUser : u))
    )
  }

  //resetear contraseña
  const handleReset = async (dni) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/usuarios/${dni}/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.detail);
        setShowResetModal(false);
        setUserToReset(null);
      } else {
        toast.error(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error al resetear contraseña:", error);
      toast.error("Ocurrió un error al intentar resetear la contraseña.");
    }
  };

  //Eliminar Usuario
  /*const handleDelete = async (dni) => {
    const confirmDelete = confirm("¿Está seguro que desea eliminar este usuario?")
    if (!confirmDelete) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/usuarios/${dni}/eliminar/`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Usuario eliminado correctamente.")
        setUsuarios((prev) => prev.filter((usuario) => usuario.dni !== dni))
      } else {
        toast.error("Error al eliminar el usuario.")
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      toast.error("Hubo un problema al conectar con el servidor.")
    }
  }*/

  const handleDeleteUser = async (dni) => {
    // En lugar de confirm(), abrimos el modal
    setUserToDelete(dni);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const dni = userToDelete;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${dni}/eliminar/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Actualizar el estado local - eliminar el usuario de la lista
      setUsuarios(usuarios.filter(usuario => usuario.dni !== dni));

      // Mostrar toast de éxito
      toast.success(`Usuario eliminado correctamente`);

      // Si tienes paginación, verificar si necesitas cambiar de página
      if (usuarios.length === 1 && pagination.page > 1) {
        handlePageChange(pagination.page - 1);
      }

    } catch (err) {
      // Mostrar toast de error
      toast.error(`Error al eliminar: ${err.message}`);
      console.error("Error deleting user:", err);
    } finally {
      // Cerrar el modal
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  //nuevo usuario
  const handleNewUser = () => {
    router.push("/dashboard/configurar-usuario/nuevo")
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Configuración de Usuarios</h1>
        <button onClick={handleNewUser} className="btn btn-primary flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          <span>Nuevo</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Usuarios Registrados</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="pl-8 pr-4 py-1 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900">
                <th>DNI</th>
                <th>Ap. Paterno</th>
                <th>Ap. Materno</th>
                <th>Nombres</th>
                <th>Rol</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.dni} className="hover:bg-gray-700">
                    <td>{usuario.dni}</td>
                    <td>{usuario.apellido_paterno}</td>
                    <td>{usuario.apellido_materno}</td>
                    <td>{usuario.nombres}</td>
                    <td>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500">
                        {usuario.rol}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(usuario.dni)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setUserToReset(usuario.dni);
                            setShowResetModal(true);
                          }}
                          className="text-yellow-500 hover:text-yellow-700"
                          title="Restablecer contraseña"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usuario.dni)}
                          className="text-red-500 hover:text-red-700"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <ConfirmModal
                          isOpen={showModal}
                          onClose={cancelDelete}
                          onConfirm={confirmDelete}
                          title="Confirmar Eliminación"
                          message={`¿Está seguro que desea eliminar el Usuario?`}
                          fuaId={userToDelete}
                          type="danger"
                        />
                        <ModalResetPassword
                          isOpen={showResetModal}
                          onClose={() => {
                            setShowResetModal(false);
                            setUserToReset(null);
                          }}
                          onConfirm={handleReset}
                          userDni={userToReset}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={usuarioSeleccionado}
        onUpdated={handleUsuarioActualizado}
      />
    </div>
  )
}
