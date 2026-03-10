"use client"

import { useState} from "react"
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
import useUser from "@/src/app/hook/useUser"

export default function Sidebar() {
  const pathname = usePathname()
  const [registroOpen, setRegistroOpen] = useState(true)
  const [reportesOpen, setReportesOpen] = useState(true)
  const [configOpen, setConfigOpen] = useState(true)
  
  const {rol} = useUser()

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-full">
      <div className="p-4">
        <div className="space-y-1">
          {/* Inicio / Dashboard */}
          <div>
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded ${
                pathname === "/dashboard" ? "bg-gray-800 font-medium" : ""
              }`}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              <span>Inicio</span>
            </Link>
          </div>

          {/* Registro Section */}
          {(rol === "responsable_pdd" || rol === "encargado_pdd" || rol === "digitador") && (
            <div>
              <button
                onClick={() => setRegistroOpen(!registroOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left text-white hover:bg-gray-800 rounded"
              >
                <div className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  <span>Registro</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${registroOpen ? "rotate-180" : ""}`} />
              </button>

              {registroOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <Link
                    href="/dashboard/registrar-fua"
                    className={`sidebar-link ${
                      pathname === "/dashboard/registrar-fua" ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <ClipboardList className="mr-2 h-5 w-5" />
                      <span>Registrar FUA</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Reportes Section */}
          {(rol === "responsable_pdd" || rol === "encargado_pdd" || rol === "digitador" || rol === "auditor") && (
            <div>
              <button
                onClick={() => setReportesOpen(!reportesOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left text-white hover:bg-gray-800 rounded"
              >
                <div className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  <span>Reportes</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${reportesOpen ? "rotate-180" : ""}`} />
              </button>

              {reportesOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <Link
                    href="/dashboard/bandeja-observados"
                    className={`sidebar-link ${
                      pathname === "/dashboard/bandeja-observados" ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      <span>Bandeja Observados</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/bandeja-extemporaneos"
                    className={`sidebar-link ${
                      pathname === "/dashboard/bandeja-extemporaneos" ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Bandeja Extemporaneos</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/detalle-procedimientos"
                    className={`sidebar-link ${
                      pathname === "/dashboard/detalle-procedimientos" ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <List className="mr-2 h-4 w-4" />
                      <span>Detalle procedimientos</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Configuración / Usuarios (solo Responsable PDD) */}
          {rol === "responsable_pdd" && (
            <div>
              <button
                onClick={() => setConfigOpen(!configOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left text-white hover:bg-gray-800 rounded"
              >
                <div className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  <span>Configuración</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${configOpen ? "rotate-180" : ""}`} />
              </button>

              {configOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <Link
                    href="/dashboard/configurar-usuario"
                    className={`sidebar-link ${
                      pathname === "/dashboard/configurar-usuario" ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <UserCog className="mr-2 h-5 w-5" />
                      Usuarios
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
