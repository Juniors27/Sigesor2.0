"use client"

import {
  AlertCircle,
  Clock,
  FileCheck,
  FileSearch,
  FileWarning,
  RefreshCw,
  ShieldCheck,
  ClipboardList,
  Activity,
} from "lucide-react"

import useDashboardStats from "@/hooks/useDashboardStats"

const fuaCards = [
  {
    key: "extemporaneos",
    title: "FUAs Extemporaneos",
    description: "Registros fuera del plazo regular de presentacion.",
    icon: Clock,
    accent: "from-orange-500/20 to-orange-400/5",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
    valueColor: "text-orange-100",
  },
  {
    key: "observados",
    title: "FUAs Observados",
    description: "Casos que requieren revision o subsanacion.",
    icon: AlertCircle,
    accent: "from-amber-500/20 to-amber-400/5",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    valueColor: "text-amber-100",
  },
]

const auditCards = [
  {
    key: "reconsideracion",
    title: "Reconsideracion",
    description: "Expedientes en seguimiento por revision complementaria.",
    icon: FileCheck,
    accent: "from-sky-500/20 to-sky-400/5",
    border: "border-sky-500/30",
    iconColor: "text-sky-400",
    valueColor: "text-sky-100",
  },
  {
    key: "pcpp",
    title: "PCPP",
    description: "Registros asociados al proceso de control correspondiente.",
    icon: FileWarning,
    accent: "from-blue-500/20 to-blue-400/5",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    valueColor: "text-blue-100",
  },
  {
    key: "fissal",
    title: "FISSAL",
    description: "Casos vinculados a validaciones y verificacion documental.",
    icon: FileSearch,
    accent: "from-emerald-500/20 to-emerald-400/5",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    valueColor: "text-emerald-100",
  },
]

export default function DashboardPageScreen() {
  const { stats, loading, error, totalRegistros, refreshDashboard } = useDashboardStats()

  const metricCards = [
    {
      label: "Total de registros monitoreados",
      value: totalRegistros,
      note: "Consolidado general de bandejas y procesos auditables.",
      icon: ClipboardList,
    },
    {
      label: "Tipos de FUA en control",
      value: stats.extemporaneos + stats.observados,
      note: "Seguimiento de observaciones y presentaciones extemporaneas.",
      icon: Activity,
    },
    {
      label: "Procesos de auditoria activos",
      value: stats.reconsideracion + stats.pcpp + stats.fissal,
      note: "Casos distribuidos por linea de revision institucional.",
      icon: ShieldCheck,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.78))] p-8 shadow-2xl shadow-slate-950/30">
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-300" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">Panel de control</h1>
                <p className="mt-2 text-sm text-slate-300">Cargando estadísticas institucionales...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-red-500/20 bg-[linear-gradient(135deg,rgba(69,10,10,0.48),rgba(15,23,42,0.9))] p-8 shadow-2xl shadow-slate-950/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">No se pudo cargar el dashboard</h1>
                  <p className="mt-1 text-sm text-red-100/85">{error}</p>
                </div>
              </div>
              <button
                onClick={refreshDashboard}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-red-400/30 bg-red-500/10 px-4 text-sm font-medium text-red-100 transition hover:bg-red-500/20"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="grid gap-3 sm:grid-cols-3">
          {metricCards.map(({ label, value, note, icon: Icon }) => (
            <div
              key={label}
              className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-200">{label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950/70">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{note}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Control de FUAs</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Registros con observación operativa o presentación fuera de plazo.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fuaCards.map(({ key, title, description, icon: Icon, accent, border, iconColor, valueColor }) => (
                <article
                  key={key}
                  className={`rounded-3xl border ${border} bg-gradient-to-br ${accent} p-5 shadow-lg shadow-slate-950/10`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{title}</p>
                      <p className={`mt-4 text-4xl font-semibold ${valueColor}`}>{stats[key]}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/35">
                      <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300/85">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Auditoría y revisión</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Distribución actual de expedientes por tipo de evaluación.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {auditCards.map(({ key, title, description, icon: Icon, accent, border, iconColor, valueColor }) => (
                <article
                  key={key}
                  className={`rounded-3xl border ${border} bg-gradient-to-r ${accent} p-5 shadow-lg shadow-slate-950/10`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{title}</p>
                      <p className={`mt-3 text-3xl font-semibold ${valueColor}`}>{stats[key]}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/35">
                      <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300/85">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Actualización manual</h2>
            <p className="mt-1 text-sm text-slate-400">
              Refresca la información para consultar el estado mas reciente de los registros.
            </p>
          </div>
          <button
            onClick={refreshDashboard}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Actualizando..." : "Actualizar datos"}
          </button>
        </section>
      </div>
    </div>
  )
}
