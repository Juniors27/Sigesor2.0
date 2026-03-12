import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ArrowLeft, Save } from "lucide-react"

import useEditUserModalForm from "@/hooks/useEditUserModalForm"

export default function EditUserModal({ open, onClose, usuario, onUpdated }) {
  const { formData, errors, handleChange, handleSave } = useEditUserModalForm({
    usuario,
    onUpdated,
    onClose,
  })

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <button onClick={onClose} className="mr-2 rounded p-1 hover:bg-gray-800">
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-xl font-semibold">Editar Usuario</h1>
                  </div>
                  <button onClick={handleSave} className="btn btn-primary flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    <span>Guardar</span>
                  </button>
                </div>

                <form onSubmit={(event) => event.preventDefault()}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h2 className="mb-4 text-lg font-medium">Datos Personales</h2>

                      <div className="mb-4">
                        <label className="mb-1 block text-sm text-gray-400">DNI:</label>
                        <input
                          type="text"
                          name="dni"
                          className={`w-full ${errors.dni ? "border-red-500" : ""}`}
                          value={formData.dni}
                          onChange={handleChange}
                          maxLength={8}
                          disabled
                        />
                        {errors.dni && <p className="mt-1 text-xs text-red-500">{errors.dni}</p>}
                      </div>

                      <div className="mb-4">
                        <label className="mb-1 block text-sm text-gray-400">Apellido Paterno:</label>
                        <input
                          type="text"
                          name="apellido_paterno"
                          className={`w-full ${errors.apellido_paterno ? "border-red-500" : ""}`}
                          value={formData.apellido_paterno}
                          onChange={handleChange}
                        />
                        {errors.apellido_paterno && <p className="mt-1 text-xs text-red-500">{errors.apellido_paterno}</p>}
                      </div>

                      <div className="mb-4">
                        <label className="mb-1 block text-sm text-gray-400">Apellido Materno:</label>
                        <input
                          type="text"
                          name="apellido_materno"
                          className="w-full"
                          value={formData.apellido_materno}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="mb-1 block text-sm text-gray-400">Nombres:</label>
                        <input
                          type="text"
                          name="nombres"
                          className={`w-full ${errors.nombres ? "border-red-500" : ""}`}
                          value={formData.nombres}
                          onChange={handleChange}
                        />
                        {errors.nombres && <p className="mt-1 text-xs text-red-500">{errors.nombres}</p>}
                      </div>
                    </div>

                    <div>
                      <h2 className="mb-4 text-lg font-medium">Datos de Acceso</h2>

                      <div className="mb-4">
                        <label className="mb-1 block text-sm text-gray-400">Rol:</label>
                        <select name="rol" className="w-full" value={formData.rol} onChange={handleChange}>
                          <option value="responsable_pdd">Responsable PDD</option>
                          <option value="encargado_pdd">Encargado PDD</option>
                          <option value="digitador">Digitador</option>
                          <option value="auditor">Auditor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
