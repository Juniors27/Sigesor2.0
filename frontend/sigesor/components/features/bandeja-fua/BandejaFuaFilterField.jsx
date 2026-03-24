"use client"

import { ChevronDown } from "lucide-react"

import DateRangePicker from "@/components/DateRangerPicker"
import { FILTER_TYPE_DATE, FILTER_TYPE_FUA, FILTER_TYPE_MONTH } from "@/components/features/bandeja-fua/bandejaFua.constants"

export default function BandejaFuaFilterField({
  filterType,
  dateRange,
  setDateRange,
  setFilterValue,
  fuaRenipress,
  fuaLote,
  setFuaLote,
  fuaNumero,
  setFuaNumero,
  filterValue,
  loadingFechas,
  fechasDisponibles,
}) {
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
          <select className="w-full appearance-none pr-10" value={filterValue} onChange={(event) => setFilterValue(event.target.value)} disabled={loadingFechas}>
            <option value="">Seleccionar mes y a\u00f1o</option>
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

