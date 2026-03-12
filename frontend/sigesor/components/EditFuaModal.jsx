"use client"

import { ChevronDown, Plus, Save, Trash2, X } from "lucide-react"

import procedimientosFua from "@/components/ProcedimientosFua"
import useEditFuaModal from "@/hooks/useEditFuaModal"

export default function EditFuaModal({ isOpen, onClose, fuaData, onSave }) {
  const {
    formFua,
    handleBlur,
    handleSubmit,
    handleAddProcedimiento,
    handleRemoveProcedimiento,
    updateFormField,
    formatNumberOnBlur,
    updateNuevoProcedimiento,
  } = useEditFuaModal({
    isOpen,
    fuaData,
    onSave,
    onClose,
  })

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-gray-800">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Editar FUA</h1>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="btn btn-primary flex items-center gap-1" type="button">
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </button>
              <button onClick={onClose} className="btn btn-secondary flex items-center gap-1" type="button">
                <X className="h-4 w-4" />
                <span>Cerrar</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gray-700 p-4">
                <h2 className="mb-4 text-lg font-medium">Datos de la Entidad</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">RENIPRESS:</label>
                    <input type="text" className="w-full" value="00005196" readOnly />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Establecimiento:</label>
                    <input type="text" className="w-full" value="H.R.D.T." readOnly />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-700 p-4">
                <h2 className="mb-4 text-lg font-medium">Fecha de Atencion</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Dia:</label>
                    <input type="text" className="w-full" maxLength="2" placeholder="DD" value={formFua.dia} onChange={(event) => updateFormField("dia", event.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Mes:</label>
                    <input type="text" className="w-full" maxLength="2" placeholder="MM" value={formFua.mes} onChange={(event) => updateFormField("mes", event.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Anio:</label>
                    <input type="text" className="w-full" maxLength="4" placeholder="AAAA" value={formFua.anio} onChange={(event) => updateFormField("anio", event.target.value)} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-700 p-4">
                <h2 className="mb-4 text-lg font-medium">Tipo de FUA</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Seleccione el tipo:</label>
                    <div className="relative">
                      <select className="w-full appearance-none pr-8" value={formFua.tipo_fua} onChange={(event) => updateFormField("tipo_fua", event.target.value)}>
                        <option value="extemporaneo">Extemporaneo</option>
                        <option value="observado">Observado</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Tipo de Auditoria:</label>
                    <div className="relative">
                      <select className="w-full appearance-none pr-8" value={formFua.tipo_auditoria} onChange={(event) => updateFormField("tipo_auditoria", event.target.value)}>
                        <option value="">Seleccionar</option>
                        <option value="reconsideracion">Reconsideracion</option>
                        <option value="pcpp">PCPP</option>
                        <option value="fissal">FISSAL</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Estado:</label>
                    <div className="relative">
                      <select className="w-full appearance-none pr-8" value={formFua.estado} onChange={(event) => updateFormField("estado", event.target.value)}>
                        <option value="observado">Observado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="enviado">Enviado</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-700 p-4">
                <h2 className="mb-4 text-lg font-medium">Datos del FUA</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">RENIPRESS:</label>
                      <input type="text" className="w-full" value="00005196" readOnly />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">Lote:</label>
                      <input type="text" className="w-full" maxLength="2" placeholder="25" value={formFua.lote} onChange={(event) => updateFormField("lote", event.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">Numero:</label>
                      <input type="text" className="w-full" maxLength="8" placeholder="00001526" value={formFua.numero} onChange={(event) => updateFormField("numero", event.target.value)} onBlur={formatNumberOnBlur} />
                    </div>
                  </div>

                  <div className="my-2 border-t border-gray-600"></div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">Cod. Prestacion:</label>
                      <input type="text" className="w-full" value={formFua.cod_prestacion} onChange={(event) => updateFormField("cod_prestacion", event.target.value)} placeholder="Ej: 065" maxLength="3" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">Prestacion Realizada:</label>
                      <input type="text" className="w-full" value={formFua.prestacion_realizada} readOnly placeholder={formFua.prestacion_realizada ? "" : "Ingrese un codigo valido"} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-700 p-4 md:col-span-2">
                <h2 className="mb-4 text-lg font-medium">Datos del Asegurado</h2>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Cod. SIS:</label>
                    <div className="flex gap-2">
                      <input type="text" className="w-full" value="180" readOnly />
                      <input type="text" className="w-full" value={formFua.cod_sis_2} onChange={(event) => updateFormField("cod_sis_2", event.target.value)} placeholder="Codigo SIS 2" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">DNI:</label>
                    <input type="text" className="w-full" maxLength="8" placeholder="12345678" value={formFua.dni} onChange={(event) => updateFormField("dni", event.target.value)} onBlur={handleBlur} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">N Hist. Clin.:</label>
                    <input type="text" className="w-full" maxLength="8" placeholder="123456" value={formFua.historia_clinica} onChange={(event) => updateFormField("historia_clinica", event.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-gray-700 p-4">
              <h2 className="mb-4 text-lg font-medium">Procedimientos</h2>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Codigo:</label>
                  <input type="text" className="w-full" value={formFua.nuevoProcedimiento?.codigo || ""} onChange={(event) => updateNuevoProcedimiento("codigo", event.target.value)} placeholder="Ej: 99203" maxLength="10" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Nombre:</label>
                  <input
                    type="text"
                    className="w-full"
                    value={formFua.nuevoProcedimiento?.nombre || ""}
                    onChange={(event) => updateNuevoProcedimiento("nombre", event.target.value)}
                    placeholder={procedimientosFua[formFua.nuevoProcedimiento?.codigo] || "Ej: Consulta medica"}
                    readOnly={!!procedimientosFua[formFua.nuevoProcedimiento?.codigo]}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Cantidad:</label>
                  <div className="flex gap-2">
                    <input type="number" className="w-full" value={formFua.nuevoProcedimiento?.cantidad || 1} min="1" onChange={(event) => updateNuevoProcedimiento("cantidad", Number.parseInt(event.target.value, 10) || 1)} />
                    <button type="button" onClick={handleAddProcedimiento} className="flex items-center rounded bg-blue-600 px-3 text-white hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-900">
                      <th className="p-2 text-left">Codigo</th>
                      <th className="p-2 text-left">Nombre</th>
                      <th className="p-2 text-right">Cantidad</th>
                      <th className="w-10 p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formFua.procedimientos.length > 0 ? (
                      formFua.procedimientos.map((proc, index) =>
                        proc ? (
                          <tr key={proc.id || index} className="hover:bg-gray-600">
                            <td className="p-2">{proc.codigo || proc.cod_prestacion}</td>
                            <td className="p-2">{proc.nombre || proc.nombre_prestacion}</td>
                            <td className="p-2 text-right">{proc.cantidad}</td>
                            <td className="p-2">
                              <button type="button" onClick={() => handleRemoveProcedimiento(proc.id || index)} className="text-red-500 hover:text-red-700" title="Eliminar">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ) : null
                      )
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-400">Sin procedimientos</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
