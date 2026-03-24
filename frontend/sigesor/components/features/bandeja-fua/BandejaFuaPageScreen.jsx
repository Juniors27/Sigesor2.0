"use client"

import { ChevronDown, ChevronLeft, ChevronRight, Edit, FileSpreadsheet, Filter, Search, Trash2 } from "lucide-react"

import ConfirmModal from "@/components/ComfirmModal"
import EditFuaModal from "@/components/EditFuaModal"
import BandejaFuaFilterField from "@/components/features/bandeja-fua/BandejaFuaFilterField"
import BandejaFuaPagination from "@/components/features/bandeja-fua/BandejaFuaPagination"
import { FUA_PAGE_SIZE_OPTIONS, FUA_STATUS_STYLES } from "@/components/features/bandeja-fua/bandejaFua.constants"
import useBandejaFua from "@/hooks/useBandejaFua"
import useClientPagination from "@/src/app/hook/useClientPagination"
import { exportFuasToExcel, formatFuaDate, formatFuaNumber, mapAuditoriaLabel, mapEstadoLabel } from "@/utils/bandejaFua"

export default function BandejaFuaPageScreen({
  trayType,
  title,
  description,
  headerAccentClass,
  headerIconColorClass,
  exportFileName,
}) {
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
  } = useBandejaFua(trayType)

  const { page, pageSize, totalItems, totalPages, paginatedItems, setPage, setPageSize, getPageNumbers } = useClientPagination(fuas, 10)

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${headerAccentClass}`}>
              <Filter className={`h-5 w-5 ${headerIconColorClass}`} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">{title}</h1>
              <p className="mt-1 text-sm text-slate-400">{description}</p>
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
              <BandejaFuaFilterField
                filterType={filterType}
                dateRange={dateRange}
                setDateRange={setDateRange}
                setFilterValue={setFilterValue}
                fuaRenipress={fuaRenipress}
                fuaLote={fuaLote}
                setFuaLote={setFuaLote}
                fuaNumero={fuaNumero}
                setFuaNumero={setFuaNumero}
                filterValue={filterValue}
                loadingFechas={loadingFechas}
                fechasDisponibles={fechasDisponibles}
              />
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
              onClick={() => exportFuasToExcel(fuas, exportFileName)}
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
                        <td className="p-4 text-slate-300">{formatFuaDate(fua.fecha_atencion)}</td>
                        <td className="p-4 text-slate-300">{fua.asegurado.cod_afiliacion}</td>
                        <td className="p-4 text-slate-300">{fua.asegurado.dni}</td>
                        <td className="p-4 text-slate-300">{fua.asegurado.historia_clinica}</td>
                        <td className="p-4 text-slate-300">{fua.cod_prestacion}</td>
                        <td className="p-4 text-slate-300">{mapAuditoriaLabel(fua.tipo_auditoria)}</td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${FUA_STATUS_STYLES[fua.estado] || "bg-slate-700 text-slate-200"}`}>
                            {mapEstadoLabel(fua.estado)}
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

          <BandejaFuaPagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            loading={loading}
            totalPages={totalPages}
            pageSizeOptions={FUA_PAGE_SIZE_OPTIONS}
            setPageSize={setPageSize}
            setPage={setPage}
            getPageNumbers={getPageNumbers}
            ChevronLeftIcon={ChevronLeft}
            ChevronRightIcon={ChevronRight}
          />
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


