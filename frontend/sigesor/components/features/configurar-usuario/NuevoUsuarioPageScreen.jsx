"use client"

import { ArrowLeft, Save } from "lucide-react"

import useNuevoUsuarioForm from "@/hooks/useNuevoUsuarioForm"

export default function NuevoUsuarioPageScreen() {
  const { formData, errors, handleChange, handleSubmit, handleCancel } = useNuevoUsuarioForm()

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={handleCancel} className="mr-2 rounded p-1 hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Nuevo Usuario</h1>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary flex items-center gap-1" type="button">
          <Save className="h-4 w-4" />
          <span>Guardar</span>
        </button>
      </div>

      <div className="rounded-lg bg-gray-800 p-6">
        <form onSubmit={handleSubmit}>
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
                <select
                  name="rol"
                  className={`w-full ${errors.rol ? "border-red-500" : ""}`}
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="responsable_pdd">Responsable PDD</option>
                  <option value="encargado_pdd">Encargado PDD</option>
                  <option value="digitador">Digitador</option>
                  <option value="auditor">Auditor</option>
                </select>
                {errors.rol && <p className="mt-1 text-xs text-red-500">{errors.rol}</p>}
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-gray-400">Contrasena:</label>
                <input
                  type="password"
                  name="password"
                  className={`w-full ${errors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
