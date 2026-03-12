"use client"

import { ChevronDown, ChevronLeft, ChevronRight, Edit, FileSpreadsheet, Filter, Search, Trash2 } from "lucide-react"
import * as XLSX from "xlsx"

import ConfirmModal from "@/components/ComfirmModal"
import DateRangePicker from "@/components/DateRangerPicker"
import EditFuaModal from "@/components/EditFuaModal"
import useFuaTray from "@/hooks/useFuaTray"
import useClientPagination from "@/src/app/hook/useClientPagination"

const FILTER_TYPE_MONTH = "Año y mes del Formato"
const FILTER_TYPE_DATE = "Fecha de Atencion"
const FILTER_TYPE_FUA = "N° de FUA"

const statusStyles = {
  observado: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  pendiente: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
  enviado: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
  rechazado: "bg-red-500/15 text-red-300 border border-red-500/20",
}

function formatFuaNumber(fua) {
  return `${fua.renipress}-${fua.lote}-${fua.numero}`
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

function mapAuditoria(tipo) {
  const labels = {
    reconsideracion: "Reconsideracion",
    pcpp: "PCPP",
    fissal: "FISSAL",
  }

  return labels[tipo] || `${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}`
}

function mapEstado(estado) {
  const labels = {
    observado: "Observado",
    pendiente: "Pendiente",
    enviado: "Enviado",
    rechazado: "Rechazado",
  }

  return labels[estado] || `${estado.charAt(0).toUpperCase()}${estado.slice(1)}`
}

export default function BandejaExtemporaneosPageScreen() {
  const {
    filterType,
    setFilterType,
    filterValue,
    setFilterValue,
    showDropdown,
    setShowDropdown,
    dateRange,
    setDateRange,
    fuaRenipress,
    fuaLote,
    setFuaLote,
    fuaNumero,
    setFuaNumero,
    fuas,
    loading,
    error,
    fechasDisponibles,
    loadingFechas,
    showModal,
    fuaToDelete,
    showEditModal,
    setShowEditModal,
    fuaToEdit,
    setFuaToEdit,
    filterOptions,
    fetchFuas,
    handleFilter,
    handleDeleteFua,
    handleEditRow,
    cancelDelete,
    confirmDelete,
  } = useFuaTray("extemporaneos")

  const pageSizeOptions = [10, 20, 30, 50]
  const { page, pageSize, totalItems, totalPages, paginatedItems, setPage, setPageSize, getPageNumbers } =
    useClientPagination(fuas, 10)

  const exportToExcel = () => {
    const dataToExport = fuas.map((fua) => ({
      "N° FUA": formatFuaNumber(fua),
      Fecha: formatDate(fua.fecha_atencion),
      Afiliacion: fua.asegurado.cod_afiliacion,
      DNI: fua.asegurado.dni,
      HC: fua.asegurado.historia_clinica,
      "Cod. Prestacion": fua.cod_prestacion,
      Auditoria: mapAuditoria(fua.tipo_auditoria),
      Estado: mapEstado(fua.estado),
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fuas")
    XLSX.writeFile(workbook, "FuasExtemporaneos.xlsx")
  }

  const renderFilterField = () => {
    switch (filterType) {
      case FILTER_TYPE_DATE:
        return (
          <DateRangePicker
            onRangeChange={(range) => {
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
      case FILTER_TYPE_FUA:
        return (
          <div className="grid gap-3 sm:grid-cols-[110px_70px_1fr]">
            <input type="text" className="w-full bg-slate-950/70" value={fuaRenipress} readOnly />
            <input
              type="text"
              className="w-full"
              value={fuaLote}
              onChange={(event) => setFuaLote(event.target.value.replace(/\D/g, "").slice(0, 2))}
              placeholder="25"
            />
            <input
              type="text"
              className="w-full"
              value={fuaNumero}
              onChange={(event) => setFuaNumero(event.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="00001526"
            />
          </div>
        )
      case FILTER_TYPE_MONTH:
        return (
          <div className="relative">
            <select
              className="w-full appearance-none pr-10"
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              disabled={loadingFechas}
            >
              <option value="">Seleccionar mes y año</option>
              {fechasDisponibles.map((fecha) => (
                <option key={fecha.id} value={fecha.value}>
                  {fecha.label} ({fecha.count})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {loadingFechas ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </div>
        )
      default:
        return <input type="text" className="w-full" value={filterValue} onChange={(event) => setFilterValue(event.target.value)} />
    }
  }

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10">
              <Filter className="h-5 w-5 text-orange-300" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Bandeja Extemporaneos</h1>
              <p className="mt-1 text-sm text-slate-400">Consulta registros extemporaneos con filtros por periodo, fecha o numero de FUA.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.45fr_1fr_auto] lg:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Tipo de filtro</label>
              <div className="relative">
                <div
                  className="flex h-11 cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-200"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span>{filterType}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
                {showDropdown && (
                  <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/40">
                    {filterOptions.map((option) => (
                      <div
                        key={option}
                        className="cursor-pointer px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Filtro</label>
              {renderFilterField()}
            </div>

            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 text-sm font-semibold text-white transition hover:brightness-110"
              onClick={handleFilter}
              disabled={loading}
            >
              <Search className="h-4 w-4" />
              {loading ? "Filtrando..." : "Filtrar"}
            </button>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Resultados</h2>
              <p className="mt-1 text-sm text-slate-400">Listado de registros disponibles en la bandeja actual.</p>
            </div>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
              onClick={exportToExcel}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exportar a Excel
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-950/80">
                  <tr>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">N° FUA</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Fecha</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Afiliacion</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">DNI</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">HC</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Cod. Press</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Auditoria</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Estado</th>
                    <th className="p-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-400">Cargando datos...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-red-300">
                        Error: {error}
                        <button onClick={() => fetchFuas()} className="ml-2 text-cyan-300 underline">Reintentar</button>
                      </td>
                    </tr>
                  ) : paginatedItems.length > 0 ? (
                    paginatedItems.map((fua) => (
                      <tr key={fua.id} className="border-t border-white/8 bg-slate-900/30 hover:bg-slate-800/70">
                        <td className="p-4 font-medium text-slate-100">{formatFuaNumber(fua)}</td>
                        <td className="p-4 text-slate-300">{formatDate(fua.fecha_atencion)}</td>
                        <td className="p-4 text-slate-300">{fua.asegurado.cod_afiliacion}</td>
                        <td className="p-4 text-slate-300">{fua.asegurado.dni}</td>
                        <td className="p-4 text-slate-300">{fua.asegurado.historia_clinica}</td>
                        <td className="p-4 text-slate-300">{fua.cod_prestacion}</td>
                        <td className="p-4 text-slate-300">{mapAuditoria(fua.tipo_auditoria)}</td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[fua.estado] || "bg-slate-700 text-slate-200"}`}>
                            {mapEstado(fua.estado)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditRow(fua)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-300 transition hover:bg-blue-500/10 hover:text-blue-200"
                              title="Editar"
                              disabled={loading}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFua(fua.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                              title="Eliminar"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-400">Sin datos</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalItems > 0 && (
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="text-sm text-slate-400">
                  Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, totalItems)} de {totalItems} registros
                </span>
                <select
                  className="h-10 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-200"
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>{size} por pagina</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {getPageNumbers().map((pageNum, index) => (
                  <button
                    key={`${pageNum}-${index}`}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm transition ${
                      pageNum === page
                        ? "bg-blue-600 text-white"
                        : pageNum === "..."
                          ? "text-slate-500"
                          : "border border-white/10 text-slate-300 hover:bg-slate-800"
                    }`}
                    onClick={() => pageNum !== "..." && setPage(pageNum)}
                    disabled={pageNum === "..." || loading}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        <EditFuaModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setFuaToEdit(null)
          }}
          fuaData={fuaToEdit}
          onSave={() => fetchFuas()}
        />
        <ConfirmModal
          isOpen={showModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Confirmar Eliminacion"
          message="Esta seguro que desea eliminar el registro del FUA?"
          fuaId={fuaToDelete}
          type="danger"
        />
      </div>
    </div>
  )
}
