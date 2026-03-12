"use client"

import { ClipboardList, Edit, Plus, Printer, Save, Search, Trash2 } from "lucide-react"

import procedimientosFua from "@/components/ProcedimientosFua"
import useDetalleProcedimientos from "@/hooks/useDetalleProcedimientos"

export default function DetalleProcedimientosPageScreen() {
  const {
    isEditing,
    fuaRenipress,
    fuaLote,
    setFuaLote,
    fuaNumero,
    setFuaNumero,
    procedimientos,
    nuevoProcedimiento,
    setNuevoProcedimiento,
    printRef,
    handleEditProcedimiento,
    handleDeleteProcedimiento,
    handleAddProcedimiento,
    handleEdit,
    handleSave,
    handleSearch,
    handlePrint,
  } = useDetalleProcedimientos()

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Detalle procedimientos</h1>
              <p className="mt-1 text-sm text-slate-400">Consulta, edita e imprime los procedimientos asociados a un FUA registrado.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handlePrint} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
              {isEditing ? (
                <button onClick={handleSave} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-4 text-sm font-semibold text-white transition hover:brightness-110">
                  <Save className="h-4 w-4" />
                  Guardar
                </button>
              ) : (
                <button onClick={handleEdit} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.7fr_0.35fr_0.8fr_auto] lg:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">RENIPRESS</label>
              <input type="text" className="w-full bg-slate-950/70" value={fuaRenipress} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Lote</label>
              <input type="text" className="w-full" value={fuaLote} onChange={(event) => setFuaLote(event.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="25" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Numero de FUA</label>
              <input type="text" className="w-full" value={fuaNumero} onChange={(event) => setFuaNumero(event.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="00001526" />
            </div>
            <button onClick={handleSearch} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 text-sm font-semibold text-white transition hover:brightness-110">
              <Search className="h-4 w-4" />
              Filtrar
            </button>
          </div>
        </section>

        {procedimientos.length > 0 && (
          <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20" ref={printRef}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10">
                <ClipboardList className="h-5 w-5 text-sky-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Procedimientos registrados</h2>
                <p className="mt-1 text-sm text-slate-400">Resultado del FUA consultado y su detalle editable.</p>
              </div>
            </div>

            {isEditing && (
              <div className="mb-6 rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Agregar procedimiento</h3>
                <div className="grid gap-4 md:grid-cols-[0.7fr_1.4fr_0.6fr_auto] md:items-end">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Codigo</label>
                    <input type="text" className="w-full" value={nuevoProcedimiento.cod_prestacion} onChange={(event) => setNuevoProcedimiento((current) => ({ ...current, cod_prestacion: event.target.value }))} placeholder="Ej: 90001" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Descripcion</label>
                    <input
                      type="text"
                      className="w-full"
                      value={nuevoProcedimiento.nombre_prestacion}
                      onChange={(event) => setNuevoProcedimiento((current) => ({ ...current, nombre_prestacion: event.target.value }))}
                      placeholder={procedimientosFua[nuevoProcedimiento.cod_prestacion] || "Ej: Consulta medica"}
                      readOnly={!!procedimientosFua[nuevoProcedimiento.cod_prestacion]}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Cantidad</label>
                    <input type="number" min="1" className="w-full" value={nuevoProcedimiento.cantidad} onChange={(event) => setNuevoProcedimiento((current) => ({ ...current, cantidad: Number.parseInt(event.target.value, 10) || 1 }))} />
                  </div>
                  <button onClick={handleAddProcedimiento} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Agregar
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-950/80">
                    <tr>
                      <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Codigo</th>
                      <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Descripcion</th>
                      <th className="p-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Cantidad</th>
                      {isEditing && <th className="p-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {procedimientos.map((procedimiento, index) => (
                      <tr key={procedimiento.id || index} className={`border-t border-white/8 ${procedimiento.isNew ? "bg-emerald-500/8" : "bg-slate-900/30"} hover:bg-slate-800/70`}>
                        <td className="p-4 font-mono text-sm text-slate-100">
                          {isEditing ? (
                            <input type="text" className="w-full" value={procedimiento.cod_prestacion} onChange={(event) => handleEditProcedimiento(index, "cod_prestacion", event.target.value)} />
                          ) : (
                            procedimiento.cod_prestacion
                          )}
                        </td>
                        <td className="p-4 text-sm text-slate-200">
                          {isEditing ? (
                            <input type="text" className="w-full" value={procedimiento.nombre_prestacion} onChange={(event) => handleEditProcedimiento(index, "nombre_prestacion", event.target.value)} />
                          ) : (
                            procedimiento.nombre_prestacion
                          )}
                        </td>
                        <td className="p-4 text-center text-sm text-slate-200">
                          {isEditing ? (
                            <input type="number" min="1" className="mx-auto w-20 text-center" value={procedimiento.cantidad} onChange={(event) => handleEditProcedimiento(index, "cantidad", event.target.value)} />
                          ) : (
                            procedimiento.cantidad
                          )}
                        </td>
                        {isEditing && (
                          <td className="p-4 text-center">
                            <button onClick={() => handleDeleteProcedimiento(index)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-500/10 hover:text-red-300" title="Eliminar procedimiento">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
