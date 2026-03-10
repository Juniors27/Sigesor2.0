"use client"

import { useState, useRef, useEffect } from "react"
import { Printer, Edit, Save, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import procedimientosFua from "@/components/ProcedimientosFua"

export default function DetalleProcedimientosPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [fuaRenipress, setFuaRenipress] = useState("5196")
  const [fuaLote, setFuaLote] = useState("")
  const [fuaNumero, setFuaNumero] = useState("")
  const printRef = useRef(null)

  // Datos de procedimientos
  const [procedimientos, setProcedimientos] = useState([])

  // Estado para nuevo procedimiento
  const [nuevoProcedimiento, setNuevoProcedimiento] = useState({
    cod_prestacion: "",
    nombre_prestacion: "",
    cantidad: 1,
  })

  // Función para manejar la edición de procedimientos existentes
  const handleEditProcedimiento = (index, field, value) => {
    setProcedimientos(
      procedimientos.map((proc, i) => {
        if (i === index) {
          return {
            ...proc,
            [field]: field === "cantidad" ? Number.parseInt(value) || 1 : value,
            // Marcar como modificado para saber qué procedimientos han cambiado
            modified: true
          }
        }
        return proc
      })
    )
  }



  // Función para eliminar procedimiento
  const handleDeleteProcedimiento = (index) => {
    if (confirm("¿Está seguro que desea eliminar este procedimiento?")) {
      setProcedimientos(procedimientos.filter((_, i) => i !== index))
    }
  }

  // Función para agregar nuevo procedimiento
  const handleAddProcedimiento = () => {
    if (nuevoProcedimiento.cod_prestacion && nuevoProcedimiento.nombre_prestacion) {
      setProcedimientos([
        ...procedimientos,
        {
          ...nuevoProcedimiento,
          // Marcar como nuevo para diferenciarlo de los existentes
          isNew: true,
          id: Date.now() // ID temporal para nuevos procedimientos
        },
      ])
      // Limpiar el formulario después de agregar
      setNuevoProcedimiento({
        cod_prestacion: "",
        nombre_prestacion: "",
        cantidad: 1,
      })
    } else {
      toast.warning("Por favor complete el código y nombre del procedimiento")
    }
  }

  // Actualizar nombre de procedimiento cuando cambia el código
  useEffect(() => {
    const codigo = nuevoProcedimiento.cod_prestacion
    const nombre = procedimientosFua[codigo]
    if (nombre && nombre !== nuevoProcedimiento.nombre_prestacion) {
      setNuevoProcedimiento((prev) => ({
        ...prev,
        nombre_prestacion: nombre,  // ✅ Correcto: actualiza directamente la propiedad
      }))
    }
  }, [nuevoProcedimiento.cod_prestacion])

  // Función para activar modo edición
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Función para guardar cambios
  const handleSave = async () => {
    try {
      // Aquí enviarías los datos actualizados al servidor
      // Ejemplo de estructura de datos para enviar:
      const dataToSave = {
        fua_renipress: fuaRenipress,
        fua_lote: fuaLote,
        fua_numero: fuaNumero,
        procedimientos: procedimientos.map(proc => ({
          cod_prestacion: proc.cod_prestacion,
          nombre_prestacion: proc.nombre_prestacion,
          cantidad: proc.cantidad,
          isNew: proc.isNew || false,
          modified: proc.modified || false
        }))
      }

      // Simular petición al servidor (descomenta y ajusta según tu API)

      const response = await fetch('http://127.0.0.1:8000/api/fua/procedimientos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los cambios');
      }


      // Limpiar las marcas de modificación después de guardar exitoso
      setProcedimientos(procedimientos.map(proc => ({
        ...proc,
        isNew: false,
        modified: false
      })))

      setIsEditing(false)
      toast.success("Cambios guardados correctamente")

    } catch (error) {
      console.error('Error al guardar:', error)
      toast.error('Error al guardar los cambios')
    }
  }

  // Función para buscar procedimientos (sin cambios)
  const handleSearch = async () => {
    if (!fuaLote || !fuaNumero) {
      toast.warning("Por favor ingrese un número de FUA completo");
      return;
    }

    try {
      const params = new URLSearchParams();
      if (fuaRenipress) params.append('renipress', fuaRenipress);
      if (fuaLote) params.append('lote', fuaLote);
      if (fuaNumero) params.append('numero', fuaNumero);

      const url = `http://127.0.0.1:8000/api/fua/procedimientos/?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const procedimientos = await response.json();
        console.log('Procedimientos encontrados:', procedimientos);

        // Resetear el modo de edición al cargar nuevos datos
        setIsEditing(false)
        setProcedimientos(procedimientos);

        if (procedimientos.length === 0) {
          toast.info('No se encontraron procedimientos para este FUA');
        }
      } else {
        console.error('Error en la respuesta:', response.status);
        toast.error('Error al buscar procedimientos');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      toast.error('Error de conexión al servidor');
    }
  };

  // Función para imprimir (sin cambios)
  const handlePrint = () => {
    if (!fuaLote || !fuaNumero) {
      toast.info("Por favor ingrese un número de FUA completo antes de imprimir")
      return
    }

    const printWindow = window.open("", "_blank")

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title> ${fuaLote}-${fuaNumero}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #000;
          }
          h1 {
            font-size: 18px;
            margin-bottom: 10px;
          }
          h2 {
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .hospital-info {
            font-size: 14px;
            margin-bottom: 5px;
          }
          .fua-number {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #666;
          }
          @media print {
            body {
              margin: 0;
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="fua-number">N° FUA: ${fuaLote}-${fuaNumero}</div>
        
        <table>
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>DESCRIPCIÓN</th>
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
            `,
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

    printWindow.onload = () => {
      printWindow.print()
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Detalle procedimientos</h1>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn btn-secondary flex items-center gap-1">
            <Printer className="h-4 w-4" />
            <span>Imprimir</span>
          </button>
          {isEditing ? (
            <button onClick={handleSave} className="btn btn-primary flex items-center gap-1">
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
          ) : (
            <button onClick={handleEdit} className="btn btn-secondary flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">N° de FUA:</label>
            <div className="flex gap-2">
              <input type="text" className="w-24" value={fuaRenipress} readOnly />
              <input
                type="text"
                className="w-12"
                value={fuaLote}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 2)
                  setFuaLote(value)
                }}
                placeholder="25"
              />
              <input
                type="text"
                className="flex-1"
                value={fuaNumero}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 8)
                  setFuaNumero(value)
                }}
                placeholder="00001526"
              />
            </div>
          </div>

          <button onClick={handleSearch} className="btn btn-primary self-end">
            Filtrar
          </button>
        </div>
      </div>

      {procedimientos.length > 0 && (
        <div className="mt-6 bg-gray-800 rounded-lg p-3" ref={printRef}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Procedimientos</h3>

          </div>

          {/* Formulario para agregar nuevo procedimiento */}
          {isEditing && (
            <div className="mb-4 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium mb-3 text-gray-300">Agregar Nuevo Procedimiento</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Código</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                    value={nuevoProcedimiento.cod_prestacion}
                    onChange={(e) =>
                      setNuevoProcedimiento({
                        ...nuevoProcedimiento,
                        cod_prestacion: e.target.value,
                      })
                    }
                    placeholder="Ej: 90001"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Descripción</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                    value={nuevoProcedimiento?.nombre_prestacion}
                    onChange={(e) =>
                      setNuevoProcedimiento({
                        ...nuevoProcedimiento,
                        nombre_prestacion: e.target.value,
                      })
                    }
                    placeholder={procedimientosFua[nuevoProcedimiento?.cod_prestacion] || "Ej: Consulta médica"}
                    readOnly={!!procedimientosFua[nuevoProcedimiento?.cod_prestacion]}  // ✅ Corregido
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                      value={nuevoProcedimiento.cantidad}
                      onChange={(e) =>
                        setNuevoProcedimiento({
                          ...nuevoProcedimiento,
                          cantidad: Number.parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <button
                    onClick={handleAddProcedimiento}
                    className="btn btn-sm btn-primary flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-900 rounded-lg">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-200 uppercase tracking-wider">
                    Cantidad
                  </th>
                  {isEditing && (
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {procedimientos.map((procedimiento, index) => (
                  <tr key={procedimiento.id || index} className={procedimiento.isNew ? "bg-green-900 bg-opacity-20" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-200">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                          value={procedimiento.cod_prestacion}
                          onChange={(e) => handleEditProcedimiento(index, "cod_prestacion", e.target.value)}
                        />
                      ) : (
                        procedimiento.cod_prestacion
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                          value={procedimiento.nombre_prestacion}
                          onChange={(e) => handleEditProcedimiento(index, "nombre_prestacion", e.target.value)}
                        />
                      ) : (
                        procedimiento.nombre_prestacion
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          className="w-20 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:outline-none text-center"
                          value={procedimiento.cantidad}
                          onChange={(e) => handleEditProcedimiento(index, "cantidad", e.target.value)}
                        />
                      ) : (
                        procedimiento.cantidad
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDeleteProcedimiento(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Eliminar procedimiento"
                        >
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
      )}
    </div>
  )
}