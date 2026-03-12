"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import procedimientosFua from "@/components/ProcedimientosFua"
import { getAuthToken } from "@/utils/storage"
import { updateExtemporaneoFua } from "@/services/trays.service"

const prestaciones = {
  "065": "Internamiento",
  "050": "Recien Nacido",
  "051": "Internamiento del Recien Nacido",
  "056": "Consulta Externa",
  "062": "Emergencia",
  "063": "Emergencia con Observacion",
  "064": "Cirugia Ambulatoria",
  "066": "Internamiento con Cirugia Menor",
  "067": "Internamiento con Cirugia Mayor",
  "070": "Apoyo al Diagnostico",
  906: "Telemedicina",
  "068": "UCI",
}

export default function useEditFuaModal({ isOpen, fuaData, onSave, onClose }) {
  const [formFua, setFormFua] = useState({
    renipress: "5196",
    dia: "",
    mes: "",
    anio: "",
    cod_prestacion: "",
    prestacion_realizada: "",
    cod_sis_1: "180",
    cod_sis_2: "",
    lote: "",
    numero: "",
    tipo_fua: "extemporaneo",
    tipo_auditoria: "",
    estado: "observado",
    dni: "",
    historia_clinica: "",
    creado_por: "",
    procedimientos: [],
    nuevoProcedimiento: { codigo: "", nombre: "", cantidad: 1 },
  })

  const token = getAuthToken()

  useEffect(() => {
    if (fuaData && isOpen) {
      const fechaParts = fuaData.fecha_atencion.split("-")
      setFormFua({
        renipress: fuaData.renipress || "5196",
        dia: fechaParts[2] || "",
        mes: fechaParts[1] || "",
        anio: fechaParts[0] || "",
        cod_prestacion: fuaData.cod_prestacion || "",
        prestacion_realizada: prestaciones[fuaData.cod_prestacion] || "",
        cod_sis_1: "180",
        cod_sis_2: fuaData.asegurado?.cod_afiliacion || "",
        lote: fuaData.lote || "",
        numero: fuaData.numero || "",
        tipo_fua: fuaData.tipo_fua || "extemporaneo",
        tipo_auditoria: fuaData.tipo_auditoria || "",
        estado: fuaData.estado || "observado",
        dni: fuaData.asegurado?.dni || "",
        historia_clinica: fuaData.asegurado?.historia_clinica || "",
        creado_por: fuaData.creado_por || "",
        procedimientos: fuaData.procedimientos || [],
        nuevoProcedimiento: { codigo: "", nombre: "", cantidad: 1 },
      })
    }
  }, [fuaData, isOpen])

  useEffect(() => {
    const nombre = prestaciones[formFua.cod_prestacion]
    setFormFua((current) => ({
      ...current,
      prestacion_realizada: nombre || "",
    }))
  }, [formFua.cod_prestacion])

  useEffect(() => {
    const codigo = formFua.nuevoProcedimiento.codigo
    const nombre = procedimientosFua[codigo]
    if (nombre && nombre !== formFua.nuevoProcedimiento.nombre) {
      setFormFua((current) => ({
        ...current,
        nuevoProcedimiento: {
          ...current.nuevoProcedimiento,
          nombre,
        },
      }))
    }
  }, [formFua.nuevoProcedimiento.codigo])

  return {
    formFua,
    handleBlur: () => {
      if (!formFua.historia_clinica) {
        setFormFua((current) => ({ ...current, historia_clinica: current.dni }))
      }
    },
    handleSubmit: async (event) => {
      event.preventDefault()

      const diaNum = parseInt(formFua.dia, 10)
      const mesNum = parseInt(formFua.mes, 10)
      const anioNum = parseInt(formFua.anio, 10)
      const hoy = new Date()
      const anioActual = hoy.getFullYear()

      if (anioNum < 2019 || anioNum > anioActual) {
        toast.error("El ano debe estar entre 2019 y el actual.")
        return
      }

      if (mesNum < 1 || mesNum > 12) {
        toast.error("El mes debe estar entre 1 y 12.")
        return
      }

      const ultimoDia = new Date(anioNum, mesNum, 0).getDate()
      if (diaNum < 1 || diaNum > ultimoDia) {
        toast.error(`El dia debe estar entre 1 y ${ultimoDia} para el mes seleccionado.`)
        return
      }

      const fechaFutura = new Date(`${anioNum}-${String(mesNum).padStart(2, "0")}-${String(diaNum).padStart(2, "0")}`)
      if (fechaFutura > hoy) {
        toast.error("La fecha de atencion no puede ser futura.")
        return
      }

      if (!token) {
        toast.error("No se encontro la sesion del usuario.")
        return
      }

      const tokenPayload = JSON.parse(atob(token.split(".")[1]))
      const userId = tokenPayload.user_id
      const fecha_atencion = `${formFua.anio}-${String(formFua.mes).padStart(2, "0")}-${String(formFua.dia).padStart(2, "0")}`

      try {
        await updateExtemporaneoFua(
          fuaData.id,
          {
            renipress: formFua.renipress,
            dia: formFua.dia,
            mes: formFua.mes,
            anio: formFua.anio,
            fecha_atencion,
            cod_prestacion: formFua.cod_prestacion,
            nombre_prestacion: formFua.prestacion_realizada,
            cod_sis_1: formFua.cod_sis_1,
            cod_sis_2: formFua.cod_sis_2,
            lote: formFua.lote,
            numero: formFua.numero,
            tipo_fua: formFua.tipo_fua,
            tipo_auditoria: formFua.tipo_auditoria,
            estado: formFua.estado,
            creado_por: userId,
            asegurado: {
              dni: formFua.dni,
              historia_clinica: formFua.historia_clinica,
              cod_afiliacion: formFua.cod_sis_2,
            },
            procedimientos: formFua.procedimientos.map((proc) => ({
              cod_prestacion: proc.codigo || proc.cod_prestacion,
              nombre_prestacion: proc.nombre || proc.nombre_prestacion,
              cantidad: proc.cantidad,
            })),
          },
          token
        )

        toast.success("FUA actualizado exitosamente")
        onSave()
        onClose()
      } catch (error) {
        console.error("Error en la respuesta:", error)
        toast.error(error.message)
      }
    },
    handleAddProcedimiento: (event) => {
      event.preventDefault()
      const { nuevoProcedimiento } = formFua
      if (nuevoProcedimiento.codigo && nuevoProcedimiento.nombre) {
        setFormFua((current) => ({
          ...current,
          procedimientos: [...current.procedimientos, { id: Date.now(), ...nuevoProcedimiento }],
          nuevoProcedimiento: { codigo: "", nombre: "", cantidad: 1 },
        }))
      } else {
        toast.error("Por favor complete el codigo y nombre del procedimiento")
      }
    },
    handleRemoveProcedimiento: (id) => {
      setFormFua((current) => ({
        ...current,
        procedimientos: current.procedimientos.filter((proc) => proc.id !== id || proc.id === undefined),
      }))
    },
    updateFormField: (field, value) => {
      setFormFua((current) => ({
        ...current,
        [field]: value,
      }))
    },
    formatNumberOnBlur: () => {
      setFormFua((current) => ({
        ...current,
        numero: current.numero.replace(/\D/g, "").padStart(8, "0"),
      }))
    },
    updateNuevoProcedimiento: (field, value) => {
      setFormFua((current) => ({
        ...current,
        nuevoProcedimiento: {
          ...current.nuevoProcedimiento,
          [field]: value,
        },
      }))
    },
  }
}
