"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { getFuaProcedures, saveFuaProcedures } from "@/services/fua.service"

export default function useDetalleProcedimientos() {
  const [isEditing, setIsEditing] = useState(false)
  const [fuaRenipress, setFuaRenipress] = useState("5196")
  const [fuaLote, setFuaLote] = useState("")
  const [fuaNumero, setFuaNumero] = useState("")
  const [procedimientos, setProcedimientos] = useState([])
  const [nuevoProcedimiento, setNuevoProcedimiento] = useState({
    cod_prestacion: "",
    nombre_prestacion: "",
    cantidad: 1,
  })
  const printRef = useRef(null)

  useEffect(() => {
    const codigo = nuevoProcedimiento.cod_prestacion
    import("@/components/ProcedimientosFua").then(({ default: procedimientosFua }) => {
      const nombre = procedimientosFua[codigo]
      if (nombre && nombre !== nuevoProcedimiento.nombre_prestacion) {
        setNuevoProcedimiento((current) => ({
          ...current,
          nombre_prestacion: nombre,
        }))
      }
    })
  }, [nuevoProcedimiento.cod_prestacion])

  return {
    isEditing,
    setIsEditing,
    fuaRenipress,
    fuaLote,
    setFuaLote,
    fuaNumero,
    setFuaNumero,
    procedimientos,
    setProcedimientos,
    nuevoProcedimiento,
    setNuevoProcedimiento,
    printRef,
    handleEditProcedimiento: (index, field, value) => {
      setProcedimientos((current) =>
        current.map((proc, currentIndex) =>
          currentIndex === index
            ? {
                ...proc,
                [field]: field === "cantidad" ? Number.parseInt(value, 10) || 1 : value,
                modified: true,
              }
            : proc
        )
      )
    },
    handleDeleteProcedimiento: (index) => {
      if (confirm("Esta seguro que desea eliminar este procedimiento?")) {
        setProcedimientos((current) => current.filter((_, currentIndex) => currentIndex !== index))
      }
    },
    handleAddProcedimiento: () => {
      if (!nuevoProcedimiento.cod_prestacion || !nuevoProcedimiento.nombre_prestacion) {
        toast.warning("Por favor complete el codigo y nombre del procedimiento")
        return
      }

      setProcedimientos((current) => [
        ...current,
        {
          ...nuevoProcedimiento,
          isNew: true,
          id: Date.now(),
        },
      ])
      setNuevoProcedimiento({
        cod_prestacion: "",
        nombre_prestacion: "",
        cantidad: 1,
      })
    },
    handleEdit: () => {
      setIsEditing(true)
    },
    handleSave: async () => {
      try {
        await saveFuaProcedures({
          fua_renipress: fuaRenipress,
          fua_lote: fuaLote,
          fua_numero: fuaNumero,
          procedimientos: procedimientos.map((proc) => ({
            cod_prestacion: proc.cod_prestacion,
            nombre_prestacion: proc.nombre_prestacion,
            cantidad: proc.cantidad,
            isNew: proc.isNew || false,
            modified: proc.modified || false,
          })),
        })

        setProcedimientos((current) =>
          current.map((proc) => ({
            ...proc,
            isNew: false,
            modified: false,
          }))
        )
        setIsEditing(false)
        toast.success("Cambios guardados correctamente")
      } catch (error) {
        console.error("Error al guardar:", error)
        toast.error(error.message)
      }
    },
    handleSearch: async () => {
      if (!fuaLote || !fuaNumero) {
        toast.warning("Por favor ingrese un numero de FUA completo")
        return
      }

      try {
        const data = await getFuaProcedures({
          renipress: fuaRenipress,
          lote: fuaLote,
          numero: fuaNumero,
        })

        setIsEditing(false)
        setProcedimientos(data)

        if (data.length === 0) {
          toast.info("No se encontraron procedimientos para este FUA")
        }
      } catch (error) {
        console.error("Error en la peticion:", error)
        toast.error(error.message)
      }
    },
    handlePrint: () => {
      if (!fuaLote || !fuaNumero) {
        toast.info("Por favor ingrese un numero de FUA completo antes de imprimir")
        return
      }

      const printWindow = window.open("", "_blank")
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${fuaLote}-${fuaNumero}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #000; }
            .fua-number { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="fua-number">N° FUA: ${fuaLote}-${fuaNumero}</div>
          <table>
            <thead>
              <tr>
                <th>CODIGO</th>
                <th>DESCRIPCION</th>
                <th style="text-align: right;">CANTIDAD</th>
              </tr>
            </thead>
            <tbody>
              ${procedimientos
                .map(
                  (proc) => `
                <tr>
                  <td>${proc.cod_prestacion}</td>
                  <td>${proc.nombre_prestacion}</td>
                  <td style="text-align: right;">${proc.cantidad}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>Este documento es un reporte generado por el sistema SIGESOR.</p>
          </div>
        </body>
        </html>
      `

      printWindow.document.open()
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.onload = () => printWindow.print()
    },
  }
}
