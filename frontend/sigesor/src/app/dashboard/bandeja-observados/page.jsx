"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Edit, Save, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import DateRangePicker from "@/components/DateRangerPicker"
import ConfirmModal from "@/components/ComfirmModal"
import * as XLSX from "xlsx"
import EditFuaModal from "@/components/EditFuaModal"

export default function BandejaObservadosPage() {
  // URL base del backend
  //const API_BASE_URL = "http://127.0.0.1"

  const [filterType, setFilterType] = useState("Año y mes del Formato")
  const [filterValue, setFilterValue] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [editingRow, setEditingRow] = useState(null)

  // Campos para N° de FUA
  const [fuaRenipress, setFuaRenipress] = useState("5196")
  const [fuaLote, setFuaLote] = useState("")
  const [fuaNumero, setFuaNumero] = useState("")

  // Estado para los datos y la paginación
  const [fuas, setFuas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estado para fechas disponibles en el filtro
  const [fechasDisponibles, setFechasDisponibles] = useState([])
  const [loadingFechas, setLoadingFechas] = useState(false)

  //modal de confirmacion delete fua
  const [showModal, setShowModal] = useState(false);
  const [fuaToDelete, setFuaToDelete] = useState(null);

  //editar fua
  const [showEditModal, setShowEditModal] = useState(false)
  const [fuaToEdit, setFuaToEdit] = useState(null)

  // Configuración de paginación
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  })

  // Opciones de tamaño de página
  const pageSizeOptions = [10, 20, 30, 50]

  // Función para formatear el número de FUA
  const formatFuaNumber = (fua) => {
    return `${fua.renipress}-${fua.lote}-${fua.numero}`
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}` // "30/05/2025"
  }


  // Función para mapear el tipo de auditoría a formato legible
  const mapAuditoria = (tipo) => {
    const map = {
      reconsideracion: "Reconsideración",
      pcpp: "PCPP",
      fissal: "FISSAL",
    }
    return map[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1)
  }

  // Función para mapear el estado a formato legible
  const mapEstado = (estado) => {
    const map = {
      observado: "Observado",
      pendiente: "Pendiente",
      enviado: "Enviado",
      rechazado: "Rechazado",
    }

    return map[estado] || estado.charAt(0).toUpperCase() + estado.slice(1)
  }

  // Función para obtener fechas disponibles para el filtro
  const fetchFechasDisponibles = async () => {
    setLoadingFechas(true)
    try {
      // Llamada real a la API para obtener las fechas disponibles
      const response = await fetch(`http://127.0.0.1:8000/api/bandeja/observados/fechas-disponibles/`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Agrupar por mes y año, sumando los conteos
      const fechasAgrupadas = {}

      data.forEach((item) => {
        const [year, month] = item.fecha.split("-")
        const key = `${year}-${month}`

        if (!fechasAgrupadas[key]) {
          const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
          ]

          fechasAgrupadas[key] = {
            id: key,
            value: `${month}/${year.slice(-2)}`,
            label: `${monthNames[parseInt(month, 10) - 1]} ${year}`,
            count: 0
          }
        }

        fechasAgrupadas[key].count += item.count
      })

      // Convertir a array y ordenar
      const fechasProcesadas = Object.values(fechasAgrupadas)
      fechasProcesadas.sort((a, b) => b.id.localeCompare(a.id))

      setFechasDisponibles(fechasProcesadas)
    } catch (err) {
      console.error("Error fetching fechas disponibles:", err)
      // En caso de error, usar un array vacío
      setFechasDisponibles([])
    } finally {
      setLoadingFechas(false)
    }
  }

  // Función para obtener datos del backend
  const fetchFuas = async (filters = {}, page = pagination.page, pageSize = pagination.pageSize) => {
    setLoading(true)
    setError(null)

    try {
      // Construir URL con parámetros de filtro y paginación
      const params = new URLSearchParams()
      console.log("Filtros recibidos en fetchFuas:", filters)
      // Añadir parámetros de paginación
      params.append("page", page)
      params.append("page_size", pageSize)

      // Añadir parámetros de filtro si existen
      if (filters.filterType && (filters.filterValue || filters.filterType === "N° de FUA")) {
        //console.log("Procesando filtro:", filters.filterType, filters.filterValue)
        switch (filters.filterType) {
          case "Año y mes del Formato":
            params.append("mes_anio", filters.filterValue)
            break
          case "Fecha de Atención":
            if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
              params.append("fecha_inicio", filters.dateRange.startDate.toISOString().split("T")[0])
              params.append("fecha_fin", filters.dateRange.endDate.toISOString().split("T")[0])
              //console.log("Añadido rango de fechas:", fechaInicio, "a", fechaFin)
            }
            break
          case "N° de FUA":
            if (filters.fuaRenipress) params.append("renipress", filters.fuaRenipress)

            if (filters.fuaLote) params.append("lote", filters.fuaLote)

            if (filters.fuaNumero) params.append("numero", filters.fuaNumero)

            break
        }
      }

      // URL del endpoint según la información proporcionada
      const url = `http://127.0.0.1:8000/api/bandeja/observados/${params.toString() ? `?${params.toString()}` : ""}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const responseData = await response.json()
      console.log("Respuesta del servidor:", responseData)
      // Manejar la respuesta según su estructura
      // Si la respuesta es un objeto con resultados y metadata de paginación
      if (responseData.results && responseData.count !== undefined) {
        // Formato DRF estándar con paginación
        setFuas(responseData.results)


        setPagination({
          page: Math.floor(responseData.count > 0 ? params.get("page") || 1 : 1),
          pageSize: Number.parseInt(params.get("page_size") || pageSize),
          totalItems: responseData.count,
          totalPages: Math.ceil(responseData.count / Number.parseInt(params.get("page_size") || pageSize)),
        })
      } else {
        // Si la respuesta es un array directo (sin paginación del backend)
        setFuas(responseData)
        // Simulamos la paginación en el frontend
        setPagination({
          page: page,
          pageSize: pageSize,
          totalItems: responseData.length,
          totalPages: Math.ceil(responseData.length / pageSize),
        })
      }
    } catch (err) {
      setError(err.message)
      console.error("Error fetching FUAs:", err)
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchFuas()
    fetchFechasDisponibles()
  }, [])

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchFuas({}, newPage, pagination.pageSize)
    }
  }

  // Función para cambiar el tamaño de página
  const handlePageSizeChange = (newSize) => {
    fetchFuas({}, 1, newSize)
  }

  const exportToExcel = () => {
    // Preparar datos para exportación
    const dataToExport = fuas.map((fua) => ({
      "N° FUA": formatFuaNumber(fua),
      Fecha: formatDate(fua.fecha_atencion),
      Afiliación: fua.asegurado.cod_afiliacion,
      DNI: fua.asegurado.dni,
      HC: fua.asegurado.historia_clinica,
      "Cod. Prestación": fua.cod_prestacion,
      Auditoría: mapAuditoria(fua.tipo_auditoria),
      Estado: mapEstado(fua.estado),
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Fuas")
    XLSX.writeFile(wb, "FuasObservados.xlsx")
  }

  // Opciones de filtro
  const filterOptions = ["Año y mes del Formato", "Fecha de Atención", "N° de FUA"]

  // Opciones de estado
  const estadoOptions = ["Observado", "Pendiente", "Enviado", "Rechazado"]

  // Actualizar el valor del filtro cuando cambia el tipo
  useEffect(() => {
    setFilterValue("")
    setFuaLote("")
    setFuaNumero("")
  }, [filterType])

  // Renderizar el campo de filtro según el tipo seleccionado
  const renderFilterField = () => {
    switch (filterType) {
      case "Fecha de Atención":
        return (
          <DateRangePicker
            onRangeChange={(range) => {
              // Verificamos si realmente hay un cambio antes de actualizar el estado
              if (
                range.startDate &&
                range.endDate &&
                (dateRange.startDate?.getTime() !== range.startDate.getTime() ||
                  dateRange.endDate?.getTime() !== range.endDate.getTime())
              ) {
                setDateRange(range)
                const start = range.startDate.toLocaleDateString("es-ES")
                const end = range.endDate.toLocaleDateString("es-ES")
                setFilterValue(`${start} - ${end}`)
              }
            }}
          />
        )
      case "N° de FUA":
        return (
          <div className="flex gap-2">
            <input type="text" className="w-24" value={fuaRenipress} readOnly />
            <input
              type="text"
              className="w-12"
              value={fuaLote}
              onChange={(e) => {
                // Solo permitir números y limitar a 2 dígitos
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
                // Solo permitir números y limitar a 8 dígitos
                const value = e.target.value.replace(/\D/g, "").slice(0, 8)
                setFuaNumero(value)
              }}
              placeholder="00001526"
            />
          </div>
        )
      case "Año y mes del Formato":
        return (
          <div className="relative">
            <select
              className="w-full pr-8 appearance-none"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              disabled={loadingFechas}
            >
              <option value="">Seleccionar mes y año</option>
              {fechasDisponibles.map((fecha) => (
                <option key={fecha.id} value={fecha.value}>
                  {fecha.label} ({fecha.count})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {loadingFechas ? (
                <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        )
      default:
        return (
          <input type="text" className="w-full" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
        )
    }
  }

  const [tempEstado, setTempEstado] = useState('');


  const handleEditRow = (fuaData) => {
    setFuaToEdit(fuaData)
    setShowEditModal(true)
  }

  
  const handleDeleteFua = async (id) => {
    // En lugar de confirm(), abrimos el modal
    setFuaToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const id = fuaToDelete;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bandeja/extemporaneos/${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Actualizar el estado local
      setFuas(fuas.filter((fua) => fua.id !== id));
      alert(`FUA ${id} eliminado correctamente`);

      // Si eliminamos el último elemento de la página actual y no es la primera página,
      // volvemos a la página anterior
      if (fuas.length === 1 && pagination.page > 1) {
        handlePageChange(pagination.page - 1);
      } else {
        // Refrescar la página actual
        fetchFuas({}, pagination.page, pagination.pageSize);
      }
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
      console.error("Error deleting FUA:", err);
    } finally {
      // Cerrar el modal
      setShowModal(false);
      setFuaToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setFuaToDelete(null);
  };


  const handleChangeEstado = (id, newEstado) => {
    setFuas(
      fuas.map((fua) => {
        if (fua.id === id) {
          return { ...fua, estado: newEstado.toLowerCase() }
        }
        return fua
      }),
    )
  }

  // Función para aplicar filtros
  const handleFilter = () => {

    const filters = {
      filterType,
      filterValue,
      dateRange,
      fuaRenipress,
      fuaLote,
      fuaNumero,
    }

    // Al filtrar, volvemos a la primera página
    fetchFuas(filters, 1, pagination.pageSize)
  }

  // Generar array de páginas para mostrar en la paginación
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages
    const currentPage = pagination.page
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Siempre mostrar la primera página
    const pages = [1]

    // Calcular el rango de páginas alrededor de la página actual
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3)

    // Ajustar si estamos cerca del inicio
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1)
    }

    // Ajustar si estamos cerca del final
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 2)
    }

    // Añadir elipsis después de la primera página si es necesario
    if (startPage > 2) {
      pages.push("...")
    }

    // Añadir páginas del rango calculado
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Añadir elipsis antes de la última página si es necesario
    if (endPage < totalPages - 1) {
      pages.push("...")
    }

    // Siempre mostrar la última página si hay más de una página
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Bandeja Observados</h1>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">Tipo de filtro:</label>
            <div className="relative">
              <div
                className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>{filterType}</span>
                <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
              </div>

              {showDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                  {filterOptions.map((option, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setFilterType(option)
                        setShowDropdown(false)
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Filtro:</label>
            {renderFilterField()}
          </div>

          <button className="btn btn-primary self-end" onClick={handleFilter} disabled={loading}>
            {loading ? "Filtrando..." : "Filtrar"}
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Resultados</h2>
          <button className="btn btn-success" onClick={exportToExcel}>
            Exportar a Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900">
                <th>N° FUA</th>
                <th>Fecha</th>
                <th>Afiliación</th>
                <th>DNI</th>
                <th>HC</th>
                <th>Cod. Press</th>
                <th>Auditoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    Cargando datos...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-red-400">
                    Error: {error}
                    <button onClick={() => fetchFuas()} className="ml-2 text-blue-500 hover:text-blue-700 underline">
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : fuas.length > 0 ? (
                fuas.map((fua) => (
                  <tr key={fua.id} className="hover:bg-gray-700">
                    <td>{formatFuaNumber(fua)}</td>
                    <td>{formatDate(fua.fecha_atencion)}</td>
                    <td>{fua.asegurado.cod_afiliacion}</td>
                    <td>{fua.asegurado.dni}</td>
                    <td>{fua.asegurado.historia_clinica}</td>
                    <td>{fua.cod_prestacion}</td>
                    <td>{mapAuditoria(fua.tipo_auditoria)}</td>
                    <td>
                      {editingRow === fua.id ? (
                        <div className="relative">
                          <select
                            className="w-full pr-8 appearance-none"
                            value={tempEstado}
                            onChange={(e) => {
                              setTempEstado(e.target.value);
                              handleChangeEstado(fua.id, e.target.value);
                            }}
                          >
                            {estadoOptions.map((option) => (
                              <option key={option} value={option}>
                                {mapEstado(option)}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${fua.estado === "observado"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : fua.estado === "pendiente"
                              ? "bg-blue-500/20 text-blue-600"
                              : fua.estado === "enviado"
                                ? "bg-green-500/20 text-green-600"
                                : fua.estado === "rechazado"
                                  ? "bg-black text-white"
                                  : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {mapEstado(fua.estado)}
                        </span>
                      )}
                    </td>
                    <td className="flex gap-2">
                      {editingRow === fua.id ? (
                        <button
                          onClick={() => handleSaveRow(fua.id)}
                          className="text-green-500 hover:text-green-700"
                          title="Guardar"
                          disabled={loading}
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditRow(fua)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Editar"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <EditFuaModal
                            isOpen={showEditModal}
                            onClose={() => {
                              setShowEditModal(false)
                              setFuaToEdit(null)
                            }}
                            fuaData={fuaToEdit}
                            onSave={() => {
                              // Refrescar los datos
                              fetchFuas({}, pagination.page, pagination.pageSize)
                            }}
                          />
                          <button
                            onClick={() => handleDeleteFua(fua.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Eliminar"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <ConfirmModal
                            isOpen={showModal}
                            onClose={cancelDelete}
                            onConfirm={confirmDelete}
                            title="Confirmar Eliminación"
                            message={`¿Está seguro que desea eliminar el registro del FUA?`}
                            fuaId={fuaToDelete}
                            type="danger"
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    Sin datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Controles de paginación */}
        {pagination.totalItems > 0 && (
          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Mostrando {(pagination.page - 1) * pagination.pageSize + 1} a{" "}
                {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} de {pagination.totalItems}{" "}
                registros
              </span>

              <div className="ml-4">
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size} por página
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded ${pageNum === pagination.page
                    ? "bg-blue-600 text-white"
                    : pageNum === "..."
                      ? ""
                      : "hover:bg-gray-700"
                    }`}
                  onClick={() => pageNum !== "..." && handlePageChange(pageNum)}
                  disabled={pageNum === "..." || loading}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
