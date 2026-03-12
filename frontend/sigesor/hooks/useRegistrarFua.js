"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import procedimientosFua from "@/components/ProcedimientosFua"
import { createFua, verifyFuaDuplicate } from "@/services/fua.service"
import { getAuthToken } from "@/utils/storage"

const INITIAL_FORM_STATE = {
  renipress: "5196",
  dia: "",
  mes: "",
  anio: "2025",
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
}

const prestaciones = {
  "050": "Recien Nacido",
  "051": "Internamiento del Recien Nacido",
  "054": "Parto Vaginal",
  "055": "Cesarea",
  "056": "Consulta Externa",
  "062": "Emergencia",
  "063": "Emergencia con Observacion",
  "064": "Cirugia Ambulatoria",
  "065": "Internamiento",
  "066": "Internamiento con Cirugia Menor",
  "067": "Internamiento con Cirugia Mayor",
  "068": "UCI",
  "070": "Apoyo al Diagnostico",
  "071": "Apoyo al Diagnostico",
  906: "Telemedicina",
}

export default function useRegistrarFua() {
  const [formFua, setFormFua] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})
  const [isCheckingFUA, setIsCheckingFUA] = useState(false)
  const token = getAuthToken()

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

  const verificarDuplicado = async (lote, numero) => {
    if (!lote || !numero || numero.length < 8 || !token) {
      return
    }

    setIsCheckingFUA(true)
    try {
      const data = await verifyFuaDuplicate({ lote, numero, token })
      if (data.existe) {
        setErrors((current) => ({
          ...current,
          numero: `Este FUA (${lote}-${numero}) ya esta registrado en el sistema`,
        }))
        toast.error("FUA duplicado", {
          description: `El FUA ${lote}-${numero} ya existe`,
        })
      } else {
        setErrors((current) => ({
          ...current,
          numero: null,
        }))
      }
    } catch (error) {
      console.error("Error al verificar FUA:", error)
    } finally {
      setIsCheckingFUA(false)
    }
  }

  const updateFormField = (field, value) => {
    setFormFua((current) => ({
      ...current,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: null,
      }))
    }
  }

  return {
    formFua,
    errors,
    isCheckingFUA,
    handleBlur: () => {
      if (!formFua.historia_clinica) {
        setFormFua((current) => ({ ...current, historia_clinica: current.dni }))
      }
    },
    handleSubmit: async (event) => {
      event.preventDefault()

      if (errors.numero) {
        toast.error("Corrige los errores antes de guardar")
        return
      }

      if (isCheckingFUA) {
        toast.error("Espera un momento", {
          description: "Estamos verificando el FUA...",
        })
        return
      }

      const { dia, mes, anio } = formFua
      const diaNum = parseInt(dia, 10)
      const mesNum = parseInt(mes, 10)
      const anioNum = parseInt(anio, 10)
      const hoy = new Date()
      const anioActual = hoy.getFullYear()

      if (anioNum < 2019 || anioNum > anioActual) {
        toast.error("El anio debe estar entre 2019 y el actual.")
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

      const fecha_atencion = `${formFua.anio}-${String(formFua.mes).padStart(2, "0")}-${String(formFua.dia).padStart(2, "0")}`
      const tokenPayload = JSON.parse(atob(token.split(".")[1]))
      const userId = tokenPayload.user_id

      try {
        await createFua(
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
              cod_prestacion: proc.codigo,
              nombre_prestacion: proc.nombre,
              cantidad: proc.cantidad,
            })),
          },
          token
        )

        toast.success("FUA registrado exitosamente")
        setFormFua(INITIAL_FORM_STATE)
        setErrors({})
      } catch (error) {
        toast.error(error.message)
      }
    },
    handleAddProcedimiento: (event) => {
      event.preventDefault()
      const { nuevoProcedimiento } = formFua

      if (!nuevoProcedimiento.codigo || !nuevoProcedimiento.nombre) {
        toast.error("Por favor complete el codigo y nombre del procedimiento")
        return
      }

      if (!procedimientosFua[nuevoProcedimiento.codigo]) {
        toast.warning("Codigo de procedimiento no encontrado en el catalogo")
      }

      setFormFua((current) => ({
        ...current,
        procedimientos: [...current.procedimientos, { id: Date.now(), ...nuevoProcedimiento }],
        nuevoProcedimiento: { codigo: "", nombre: "", cantidad: 1 },
      }))
    },
    handleRemoveProcedimiento: (id) => {
      setFormFua((current) => ({
        ...current,
        procedimientos: current.procedimientos.filter((proc) => proc.id !== id),
      }))
    },
    updateFormField,
    formatNumberOnBlur: () => {
      const numeroFormateado = formFua.numero.replace(/\D/g, "").padStart(8, "0")
      setFormFua((current) => ({
        ...current,
        numero: numeroFormateado,
      }))

      if (formFua.lote && numeroFormateado.length === 8) {
        verificarDuplicado(formFua.lote, numeroFormateado)
      }
    },
    handleLoteChange: (value) => {
      updateFormField("lote", value)
      if (value && formFua.numero.length === 8) {
        verificarDuplicado(value, formFua.numero)
      }
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
