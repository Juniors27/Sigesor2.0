"use client"

import { useRef, useState } from "react"
import { AlertCircle, CalendarDays, ChevronDown, ClipboardList, FileText, Plus, Save, ShieldCheck, Trash2, UserSquare2 } from "lucide-react"
import { toast } from "sonner"

import procedimientosFua from "@/components/ProcedimientosFua"
import useRegistrarFua from "@/hooks/useRegistrarFua"

export default function RegistrarFuaPageScreen() {
  const formRef = useRef(null)
  const [showProcedimientoCodigoError, setShowProcedimientoCodigoError] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
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
  const procedimientoCodigoActual = formFua?.nuevoProcedimiento?.codigo?.trim() || ""
  const procedimientoCodigoDuplicado = procedimientoCodigoActual ? formFua?.procedimientos?.some((proc) => proc.codigo === procedimientoCodigoActual) : false

  const setFieldError = (field, message) => {
    setFieldErrors((current) => ({
      ...current,
      [field]: message,
    }))
  }

  const clearFieldError = (field) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }

      return {
        ...current,
        [field]: null,
      }
    })
  }

  const validateEnterStep = (enterKey) => {
    const dia = Number.parseInt(formFua.dia, 10)
    const mes = Number.parseInt(formFua.mes, 10)
    const procedimientoCodigo = formFua.nuevoProcedimiento?.codigo?.trim() || ""

    if (enterKey === "fecha-dia") {
      if (!formFua.dia.trim()) {
        setFieldError("dia", "Campo obligatorio")
        return false
      }

      if (Number.isNaN(dia) || dia < 1 || dia > 31) {
        setFieldError("dia", "Dato invalido")
        return false
      }
    }
    clearFieldError("dia")

    if (enterKey === "fecha-mes") {
      if (!formFua.mes.trim()) {
        setFieldError("mes", "Campo obligatorio")
        return false
      }

      if (Number.isNaN(mes) || mes < 1 || mes > 12) {
        setFieldError("mes", "Dato invalido")
        return false
      }
    }
    clearFieldError("mes")

    if (["fua-lote", "fua-numero", "fua-cod-prestacion"].includes(enterKey) && !formFua.lote.trim()) {
      setFieldError("lote", "Campo obligatorio")
      return false
    }
    clearFieldError("lote")

    if (["fua-numero", "fua-cod-prestacion"].includes(enterKey) && !formFua.numero.trim()) {
      setFieldError("numero", "Campo obligatorio")
      return false
    }
    clearFieldError("numero")

    if (enterKey === "procedimiento-codigo") {
      if (!procedimientoCodigo) {
        setShowProcedimientoCodigoError(true)
        setFieldError("procedimientoCodigo", "Campo obligatorio")
        return false
      }

      if (formFua.procedimientos.some((proc) => proc.codigo === procedimientoCodigo)) {
        setShowProcedimientoCodigoError(true)
        setFieldError("procedimientoCodigo", "Dato invalido")
        toast.error(`El codigo ${procedimientoCodigo} ya fue ingresado`)
        return false
      }
    }
    clearFieldError("procedimientoCodigo")

    return true
  }

  const handleEnterNavigation = (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
      return
    }

    const target = event.target
    const tagName = target.tagName.toLowerCase()
    const type = (target.getAttribute("type") || "").toLowerCase()
    const enterKey = target.getAttribute("data-enter-key")

    if (tagName === "textarea" || type === "submit") {
      return
    }

    const formElement = formRef.current

    if (!formElement) {
      return
    }

    const focusElement = (selector) => {
      const element = formElement.querySelector(selector)

      if (!element || element.disabled) {
        return false
      }

      if (element.getAttribute("readonly") !== null) {
        return false
      }

      element.focus()
      return true
    }

    const customEnterFlow = {
      "fecha-dia": "[data-enter-key='fecha-mes']",
      "fecha-mes": "[data-enter-key='fecha-anio']",
      "fecha-anio": "[data-enter-key='fua-lote']",
      "fua-lote": "[data-enter-key='fua-numero']",
      "fua-numero": "[data-enter-key='fua-cod-prestacion']",
      "fua-cod-prestacion": "[data-enter-key='asegurado-cod-sis-2']",
      "asegurado-cod-sis-2": "[data-enter-key='asegurado-dni']",
      "asegurado-dni": "[data-enter-key='asegurado-historia-clinica']",
      "asegurado-historia-clinica": "[data-enter-key='clasificacion-tipo-fua']",
      "clasificacion-tipo-fua": "[data-enter-key='clasificacion-tipo-auditoria']",
      "clasificacion-tipo-auditoria": "[data-enter-key='clasificacion-estado']",
      "clasificacion-estado": "[data-enter-key='procedimiento-codigo']",
      "procedimiento-codigo":
        formElement.querySelector("[data-enter-key='procedimiento-nombre']")?.getAttribute("readonly") === null
          ? "[data-enter-key='procedimiento-nombre']"
          : "[data-enter-key='procedimiento-cantidad']",
      "procedimiento-nombre": "[data-enter-key='procedimiento-cantidad']",
      "procedimiento-cantidad": "[data-enter-key='procedimiento-agregar']",
      "procedimiento-agregar": "[data-enter-key='procedimiento-codigo']",
    }

    const nextSelector = enterKey ? customEnterFlow[enterKey] : null

    if (nextSelector) {
      if (!validateEnterStep(enterKey)) {
        event.preventDefault()
        target.focus()
        return
      }

      event.preventDefault()
      target.blur()

      if (tagName === "button" && type === "button") {
        target.click()
      }

      if (focusElement(nextSelector)) {
        return
      }
    }

    if (tagName === "button") {
      return
    }

    const focusableFields = Array.from(formElement.querySelectorAll("input, select, textarea, button, [tabindex]:not([tabindex='-1'])")).filter((element) => {
      if (element.disabled) {
        return false
      }

      if (element.getAttribute("readonly") !== null) {
        return false
      }

      if (element.getAttribute("type") === "hidden") {
        return false
      }

      return true
    })

    const currentIndex = focusableFields.indexOf(target)
    const nextField = focusableFields[currentIndex + 1]

    if (!nextField) {
      return
    }

    event.preventDefault()
    target.blur()
    nextField.focus()
  }

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleEnterNavigation} className="mx-auto max-w-7xl space-y-6">
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
                  <input
                    type="text"
                    className={`w-full ${fieldErrors.dia ? "border-red-500 focus:ring-red-500/30" : ""}`}
                    maxLength="2"
                    placeholder="DD"
                    value={formFua.dia}
                    onChange={(event) => {
                      updateFormField("dia", event.target.value)
                      clearFieldError("dia")
                    }}
                    data-enter-key="fecha-dia"
                    autoFocus
                  />
                  {fieldErrors.dia && <p className="mt-2 text-xs text-red-300">{fieldErrors.dia}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Mes</label>
                  <input
                    type="text"
                    className={`w-full ${fieldErrors.mes ? "border-red-500 focus:ring-red-500/30" : ""}`}
                    maxLength="2"
                    placeholder="MM"
                    value={formFua.mes}
                    onChange={(event) => {
                      updateFormField("mes", event.target.value)
                      clearFieldError("mes")
                    }}
                    data-enter-key="fecha-mes"
                  />
                  {fieldErrors.mes && <p className="mt-2 text-xs text-red-300">{fieldErrors.mes}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Anio</label>
                  <input type="text" className="w-full" maxLength="4" placeholder="AAAA" value={formFua.anio} onChange={(event) => updateFormField("anio", event.target.value)} data-enter-key="fecha-anio" />
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
                    <select className="w-full appearance-none pr-8" value={formFua.tipo_fua} onChange={(event) => updateFormField("tipo_fua", event.target.value)} data-enter-key="clasificacion-tipo-fua">
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
                    <select className="w-full appearance-none pr-8" value={formFua.tipo_auditoria} onChange={(event) => updateFormField("tipo_auditoria", event.target.value)} data-enter-key="clasificacion-tipo-auditoria">
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
                    <select className="w-full appearance-none pr-8" value={formFua.estado} onChange={(event) => updateFormField("estado", event.target.value)} data-enter-key="clasificacion-estado">
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
                    <input
                      type="text"
                      className={`w-full ${fieldErrors.lote ? "border-red-500 focus:ring-red-500/30" : ""}`}
                      maxLength="2"
                      placeholder="25"
                      value={formFua.lote}
                      onChange={(event) => {
                        handleLoteChange(event.target.value)
                        clearFieldError("lote")
                      }}
                      data-enter-key="fua-lote"
                    />
                    {fieldErrors.lote && <p className="mt-2 text-xs text-red-300">{fieldErrors.lote}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Numero</label>
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full ${errors.numero || fieldErrors.numero ? "border-red-500 focus:ring-red-500/30" : ""}`}
                        maxLength="8"
                        placeholder="00001526"
                        value={formFua.numero}
                        onChange={(event) => {
                          updateFormField("numero", event.target.value)
                          clearFieldError("numero")
                        }}
                        onBlur={formatNumberOnBlur}
                        data-enter-key="fua-numero"
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
                    {!errors.numero && fieldErrors.numero && <p className="mt-2 text-xs text-red-300">{fieldErrors.numero}</p>}
                  </div>
                </div>

                <div className="border-t border-white/8"></div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Cod. prestacion</label>
                    <input type="text" className="w-full" value={formFua.cod_prestacion} onChange={(event) => updateFormField("cod_prestacion", event.target.value)} placeholder="Ej: 065" maxLength="3" data-enter-key="fua-cod-prestacion" />
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
                    <input type="text" className="w-full" value={formFua.cod_sis_2} onChange={(event) => updateFormField("cod_sis_2", event.target.value)} placeholder="Codigo SIS 2" data-enter-key="asegurado-cod-sis-2" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">DNI</label>
                  <input type="text" className="w-full" maxLength="8" placeholder="12345678" value={formFua.dni} onChange={(event) => updateFormField("dni", event.target.value)} onBlur={handleBlur} data-enter-key="asegurado-dni" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">N. Hist. Clin.</label>
                  <input type="text" className="w-full" maxLength="8" placeholder="123456" value={formFua.historia_clinica} onChange={(event) => updateFormField("historia_clinica", event.target.value)} data-enter-key="asegurado-historia-clinica" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10">
              <ClipboardList className="h-5 w-5 text-sky-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Procedimientos</h2>
              <p className="mt-1 text-sm text-slate-400">Agrega y administra los procedimientos vinculados al expediente.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr_0.6fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Codigo</label>
              <input
                type="text"
                className={`w-full ${showProcedimientoCodigoError && (!procedimientoCodigoActual || procedimientoCodigoDuplicado || fieldErrors.procedimientoCodigo) ? "border-red-500 focus:ring-red-500/30" : ""}`}
                value={formFua.nuevoProcedimiento?.codigo || ""}
                onChange={(event) => {
                  updateNuevoProcedimiento("codigo", event.target.value)
                  clearFieldError("procedimientoCodigo")

                  if (event.target.value.trim() && !formFua.procedimientos.some((proc) => proc.codigo === event.target.value.trim())) {
                    setShowProcedimientoCodigoError(false)
                  }
                }}
                placeholder="Ej: 99203"
                maxLength="10"
                data-enter-key="procedimiento-codigo"
              />
              {fieldErrors.procedimientoCodigo && <p className="mt-2 text-xs text-red-300">{fieldErrors.procedimientoCodigo}</p>}
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
                data-enter-key="procedimiento-nombre"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Cantidad</label>
              <div className="flex gap-2">
                <input type="number" className="w-full" value={formFua.nuevoProcedimiento?.cantidad || 1} min="1" onChange={(event) => updateNuevoProcedimiento("cantidad", Number.parseInt(event.target.value, 10) || 1)} data-enter-key="procedimiento-cantidad" />
                <button type="button" onClick={handleAddProcedimiento} className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700" data-enter-key="procedimiento-agregar">
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

          <div className="mt-6 flex justify-end">
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 text-sm font-semibold text-white transition hover:brightness-110" data-enter-key="guardar-registro">
              <Save className="h-4 w-4" />
              Guardar registro
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}

