"use client"

import { Edit, RefreshCw, Trash2, UserPlus, Search, Users } from "lucide-react"

import ConfirmModal from "@/components/ComfirmModal"
import EditUserModal from "@/components/EditUserModal"
import ModalResetPassword from "@/components/ModalResetPassword"
import useUsersAdmin from "@/hooks/useUsersAdmin"

export default function ConfigurarUsuarioPageScreen() {
  const {
    searchTerm,
    setSearchTerm,
    modalOpen,
    setModalOpen,
    usuarioSeleccionado,
    showModal,
    showResetModal,
    setShowResetModal,
    userToDelete,
    userToReset,
    filteredUsuarios,
    handleEdit,
    handleUsuarioActualizado,
    handleReset,
    handleDeleteUser,
    confirmDelete,
    cancelDelete,
    handleNewUser,
    setUserToReset,
  } = useUsersAdmin()

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Users className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">Configuracion de Usuarios</h1>
                <p className="mt-1 text-sm text-slate-400">Administra usuarios, roles y acciones de soporte operativo.</p>
              </div>
            </div>
            <button
              onClick={handleNewUser}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <UserPlus className="h-4 w-4" />
              Nuevo
            </button>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Usuarios registrados</h2>
              <p className="mt-1 text-sm text-slate-400">Busqueda rapida y gestion de acciones por usuario.</p>
            </div>
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Buscar usuario..."
                className="w-full pl-10 pr-4"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-950/80">
                  <tr>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">DNI</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Ap. Paterno</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Ap. Materno</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Nombres</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Rol</th>
                    <th className="p-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.length > 0 ? (
                    filteredUsuarios.map((usuario) => (
                      <tr key={usuario.dni} className="border-t border-white/8 bg-slate-900/30 hover:bg-slate-800/70">
                        <td className="p-4 font-medium text-slate-100">{usuario.dni}</td>
                        <td className="p-4 text-slate-300">{usuario.apellido_paterno}</td>
                        <td className="p-4 text-slate-300">{usuario.apellido_materno}</td>
                        <td className="p-4 text-slate-300">{usuario.nombres}</td>
                        <td className="p-4">
                          <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">
                            {usuario.rol}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(usuario.dni)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-300 transition hover:bg-blue-500/10 hover:text-blue-200"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setUserToReset(usuario.dni)
                                setShowResetModal(true)
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-amber-300 transition hover:bg-amber-500/10 hover:text-amber-200"
                              title="Restablecer contrasena"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(usuario.dni)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <ConfirmModal
          isOpen={showModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Confirmar Eliminacion"
          message="Esta seguro que desea eliminar el Usuario?"
          fuaId={userToDelete}
          type="danger"
        />
        <ModalResetPassword
          isOpen={showResetModal}
          onClose={() => {
            setShowResetModal(false)
            setUserToReset(null)
          }}
          onConfirm={handleReset}
          userDni={userToReset}
        />
        <EditUserModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          usuario={usuarioSeleccionado}
          onUpdated={handleUsuarioActualizado}
        />
      </div>
    </div>
  )
}
