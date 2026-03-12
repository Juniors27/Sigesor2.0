"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  ChevronDown,
  ClipboardList,
  BarChart2,
  AlertCircle,
  Clock,
  List,
  Settings,
  UserCog,
} from "lucide-react"
import useUser from "@/hooks/useUser"

function NavLink({ href, active, icon: Icon, children, compact = false }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
        active
          ? "bg-gradient-to-r from-blue-600 to-cyan-500 font-medium text-white shadow-lg shadow-blue-950/30"
          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
      } ${compact ? "py-2.5 text-[13px]" : ""}`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          active ? "bg-white/15 text-white" : "bg-slate-900/70 text-slate-400 group-hover:text-cyan-300"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{children}</span>
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [registroOpen, setRegistroOpen] = useState(true)
  const [reportesOpen, setReportesOpen] = useState(true)
  const [configOpen, setConfigOpen] = useState(true)

  const { rol } = useUser()

  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-[linear-gradient(180deg,rgba(9,16,28,0.98),rgba(12,24,40,0.96))] px-4 py-5 shadow-[8px_0_30px_rgba(2,6,23,0.18)]">
      <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
        <NavLink href="/dashboard" active={pathname === "/dashboard"} icon={LayoutDashboard}>
          Inicio
        </NavLink>

        {(rol === "responsable_pdd" || rol === "encargado_pdd" || rol === "digitador") && (
          <div className="rounded-[24px] border border-white/8 bg-slate-900/45 p-2">
            <button
              onClick={() => setRegistroOpen(!registroOpen)}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800/80"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/70 text-slate-400">
                  <FileText className="h-4 w-4" />
                </span>
                <span>Registro</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${registroOpen ? "rotate-180" : ""}`} />
            </button>

            {registroOpen && (
              <div className="mt-1 space-y-1">
                <NavLink
                  href="/dashboard/registrar-fua"
                  active={pathname === "/dashboard/registrar-fua"}
                  icon={ClipboardList}
                  compact
                >
                  Registrar FUA
                </NavLink>
              </div>
            )}
          </div>
        )}

        {(rol === "responsable_pdd" || rol === "encargado_pdd" || rol === "digitador" || rol === "auditor") && (
          <div className="rounded-[24px] border border-white/8 bg-slate-900/45 p-2">
            <button
              onClick={() => setReportesOpen(!reportesOpen)}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800/80"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/70 text-slate-400">
                  <BarChart2 className="h-4 w-4" />
                </span>
                <span>Reportes</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${reportesOpen ? "rotate-180" : ""}`} />
            </button>

            {reportesOpen && (
              <div className="mt-1 space-y-1">
                <NavLink
                  href="/dashboard/bandeja-observados"
                  active={pathname === "/dashboard/bandeja-observados"}
                  icon={AlertCircle}
                  compact
                >
                  Bandeja Observados
                </NavLink>
                <NavLink
                  href="/dashboard/bandeja-extemporaneos"
                  active={pathname === "/dashboard/bandeja-extemporaneos"}
                  icon={Clock}
                  compact
                >
                  Bandeja Extemporaneos
                </NavLink>
                <NavLink
                  href="/dashboard/detalle-procedimientos"
                  active={pathname === "/dashboard/detalle-procedimientos"}
                  icon={List}
                  compact
                >
                  Detalle procedimientos
                </NavLink>
              </div>
            )}
          </div>
        )}

        {rol === "responsable_pdd" && (
          <div className="rounded-[24px] border border-white/8 bg-slate-900/45 p-2">
            <button
              onClick={() => setConfigOpen(!configOpen)}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800/80"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/70 text-slate-400">
                  <Settings className="h-4 w-4" />
                </span>
                <span>Configuracion</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${configOpen ? "rotate-180" : ""}`} />
            </button>

            {configOpen && (
              <div className="mt-1 space-y-1">
                <NavLink
                  href="/dashboard/configurar-usuario"
                  active={pathname === "/dashboard/configurar-usuario"}
                  icon={UserCog}
                  compact
                >
                  Usuarios
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  )
}
