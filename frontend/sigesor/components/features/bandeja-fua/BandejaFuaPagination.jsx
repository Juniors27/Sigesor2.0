"use client"

export default function BandejaFuaPagination({
  page,
  pageSize,
  totalItems,
  loading,
  totalPages,
  pageSizeOptions,
  setPageSize,
  setPage,
  getPageNumbers,
  ChevronLeftIcon,
  ChevronRightIcon,
}) {
  if (totalItems <= 0) {
    return null
  }

  return (
    <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="text-sm text-slate-400">
          Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, totalItems)} de {totalItems} registros
        </span>
        <select className="h-10 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-200" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} por pagina
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || loading}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        {getPageNumbers().map((pageNum, index) => (
          <button
            key={`${pageNum}-${index}`}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm transition ${
              pageNum === page ? "bg-blue-600 text-white" : pageNum === "..." ? "text-slate-500" : "border border-white/10 text-slate-300 hover:bg-slate-800"
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
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

