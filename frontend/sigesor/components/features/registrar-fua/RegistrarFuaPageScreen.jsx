"use client"

import { AlertCircle, CalendarDays, ChevronDown, ClipboardList, FileText, Plus, Save, ShieldCheck, Trash2, UserSquare2 } from "lucide-react"

import procedimientosFua from "@/components/ProcedimientosFua"
import useRegistrarFua from "@/hooks/useRegistrarFua"

export default function RegistrarFuaPageScreen() {
  const {
    formFua,
    errors,
    isCheckingFUA,
    handleBlur,
    handleSubmit,
    handleAddProcedimiento,
    handleRemoveProcedimiento,
    updateFormField,
    formatNumberOnBlur,
    handleLoteChange,
    updateNuevoProcedimiento,
  } = useRegistrarFua()

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10">
                  <ShieldCheck className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Datos de la entidad</h2>
                  <p className="mt-1 text-sm text-slate-400">Informacion fija del establecimiento registrador.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">RENIPRESS</label>
                  <input type="text" className="w-full bg-slate-950/70" value="00005196" readOnly />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Establecimiento</label>
                  <input type="text" className="w-full bg-slate-950/70" value="H.R.D.T." readOnly />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                  <CalendarDays className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Fecha de atencion</h2>
                  <p className="mt-1 text-sm text-slate-400">Registra la fecha exacta en la que se realizo la atencion.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Dia</label>
                  <input type="text" className="w-full" maxLength="2" placeholder="DD" value={formFua.dia} onChange={(event) => updateFormField("dia", event.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Mes</label>
                  <input type="text" className="w-full" maxLength="2" placeholder="MM" value={formFua.mes} onChange={(event) => updateFormField("mes", event.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Anio</label>
                  <input type="text" className="w-full" maxLength="4" placeholder="AAAA" value={formFua.anio} onChange={(event) => updateFormField("anio", event.target.value)} />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10">
                  <FileText className="h-5 w-5 text-violet-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Clasificacion del registro</h2>
                  <p className="mt-1 text-sm text-slate-400">Define el tipo de FUA, auditoria y estado actual.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Tipo de FUA</label>
                  <div className="relative">
                    <select className="w-full appearance-none pr-8" value={formFua.tipo_fua} onChange={(event) => updateFormField("tipo_fua", event.target.value)}>
                      <option value="extemporaneo">Extemporaneo</option>
                      <option value="observado">Observado</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Tipo de auditoria</label>
                  <div className="relative">
                    <select className="w-full appearance-none pr-8" value={formFua.tipo_auditoria} onChange={(event) => updateFormField("tipo_auditoria", event.target.value)}>
                      <option value="">Seleccionar</option>
                      <option value="reconsideracion">Reconsideracion</option>
                      <option value="pcpp">PCPP</option>
                      <option value="fissal">FISSAL</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Estado</label>
                  <div className="relative">
                    <select className="w-full appearance-none pr-8" value={formFua.estado} onChange={(event) => updateFormField("estado", event.target.value)}>
                      <option value="observado">Observado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="enviado">Enviado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10">
                  <ClipboardList className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Datos del FUA</h2>
                  <p className="mt-1 text-sm text-slate-400">Control de numeracion y detalle principal de la prestacion.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">RENIPRESS</label>
                    <input type="text" className="w-full bg-slate-950/70" value="00005196" readOnly />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Lote</label>
                    <input type="text" className="w-full" maxLength="2" placeholder="25" value={formFua.lote} onChange={(event) => handleLoteChange(event.target.value)} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Numero</label>
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full ${errors.numero ? "border-red-500 focus:ring-red-500/30" : ""}`}
                        maxLength="8"
                        placeholder="00001526"
                        value={formFua.numero}
                        onChange={(event) => updateFormField("numero", event.target.value)}
                        onBlur={formatNumberOnBlur}
                      />
                      {isCheckingFUA && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    {errors.numero && (
                      <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <p>{errors.numero}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/8"></div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Cod. prestacion</label>
                    <input type="text" className="w-full" value={formFua.cod_prestacion} onChange={(event) => updateFormField("cod_prestacion", event.target.value)} placeholder="Ej: 065" maxLength="3" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Prestacion realizada</label>
                    <input type="text" className="w-full bg-slate-950/70" value={formFua.prestacion_realizada} readOnly placeholder={formFua.prestacion_realizada ? "" : "Ingrese un codigo valido"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <UserSquare2 className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Datos del asegurado</h2>
                  <p className="mt-1 text-sm text-slate-400">Informacion basica del afiliado asociada al FUA.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Cod. SIS</label>
                  <div className="flex gap-2">
                    <input type="text" className="w-full bg-slate-950/70" value="180" readOnly />
                    <input type="text" className="w-full" value={formFua.cod_sis_2} onChange={(event) => updateFormField("cod_sis_2", event.target.value)} placeholder="Codigo SIS 2" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">DNI</label>
                  <input type="text" className="w-full" maxLength="8" placeholder="12345678" value={formFua.dni} onChange={(event) => updateFormField("dni", event.target.value)} onBlur={handleBlur} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">N. Hist. Clin.</label>
                  <input type="text" className="w-full" maxLength="8" placeholder="123456" value={formFua.historia_clinica} onChange={(event) => updateFormField("historia_clinica", event.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10">
                <ClipboardList className="h-5 w-5 text-sky-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Procedimientos</h2>
                <p className="mt-1 text-sm text-slate-400">Agrega y administra los procedimientos vinculados al expediente.</p>
              </div>
            </div>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 text-sm font-semibold text-white transition hover:brightness-110">
              <Save className="h-4 w-4" />
              Guardar registro
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr_0.6fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Codigo</label>
              <input type="text" className="w-full" value={formFua.nuevoProcedimiento?.codigo || ""} onChange={(event) => updateNuevoProcedimiento("codigo", event.target.value)} placeholder="Ej: 99203" maxLength="10" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Nombre</label>
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
              <label className="mb-2 block text-sm font-medium text-slate-300">Cantidad</label>
              <div className="flex gap-2">
                <input type="number" className="w-full" value={formFua.nuevoProcedimiento?.cantidad || 1} min="1" onChange={(event) => updateNuevoProcedimiento("cantidad", Number.parseInt(event.target.value, 10) || 1)} />
                <button type="button" onClick={handleAddProcedimiento} className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-950/80">
                  <tr>
                    <th className="p-4 text-left">Codigo</th>
                    <th className="p-4 text-left">Nombre</th>
                    <th className="p-4 text-right">Cantidad</th>
                    <th className="w-16 p-4 text-center">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {formFua.procedimientos.length > 0 ? (
                    formFua.procedimientos.map((proc) =>
                      proc ? (
                        <tr key={proc.id} className="border-t border-white/8 bg-slate-900/30 hover:bg-slate-800/70">
                          <td className="p-4 font-medium text-slate-100">{proc.codigo}</td>
                          <td className="p-4 text-slate-300">{proc.nombre}</td>
                          <td className="p-4 text-right text-slate-200">{proc.cantidad}</td>
                          <td className="p-4 text-center">
                            <button type="button" onClick={() => handleRemoveProcedimiento(proc.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-500/10 hover:text-red-300" title="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ) : null
                    )
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-slate-400">No hay procedimientos agregados en este registro.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}
