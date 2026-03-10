"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Clock, FileCheck,FileWarning, FileSearch } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    extemporaneos: 0,
    observados: 0,
    reconsideracion: 0,
    pcpp: 0,
    fissal: 0,
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para obtener las estadísticas del dashboard
  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Hacer petición a tu API para obtener las estadísticas
      const response = await fetch("http://127.0.0.1:8000/api/dashboard/stats/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Agregar headers de autenticación si los necesitas
          // "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al obtener las estadísticas")
      }

      const data = await response.json()
      
      // Actualizar el estado con los datos reales
      setStats({
        extemporaneos: data.extemporaneos || 0,
        observados: data.observados || 0,
        reconsideracion: data.reconsideracion || 0,
        pcpp: data.pcpp || 0,
        fissal: data.fissal || 0,
      })
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setError("Error al cargar las estadísticas del dashboard")
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchDashboardStats()
  }, [])

  // Mostrar loading
  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-6">Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">Cargando estadísticas...</div>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-6">Dashboard</h1>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-400">{error}</span>
          </div>
          <button 
            onClick={fetchDashboardStats}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>

      {/* Tarjetas de Estados */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4 text-gray-300">Tipos de FUAs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">FUAs Extemporáneos</p>
                <p className="text-2xl font-semibold">{stats.extemporaneos}</p>
              </div>
              <Clock className="h-10 w-10 text-orange-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">FUAs Observados</p>
                <p className="text-2xl font-semibold">{stats.observados}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-yellow-500 opacity-80" />
            </div>
          </div>

        </div>
      </div>

      {/* Tarjetas de Tipos de Auditoría */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4 text-gray-300">Tipos de Auditoría</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Reconsideración</p>
                <p className="text-2xl font-semibold">{stats.reconsideracion}</p>
              </div>
              <FileCheck className="h-10 w-10 text-purple-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">PCPP</p>
                <p className="text-2xl font-semibold">{stats.pcpp}</p>
              </div>
              <FileWarning className="h-10 w-10 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">FISSAL</p>
                <p className="text-2xl font-semibold">{stats.fissal}</p>
              </div>
              <FileSearch className="h-10 w-10 text-green-500 opacity-80" />
            </div>
          </div>

        </div>
      </div>

      {/* Botón para actualizar datos */}
      <div className="flex justify-end">
        <button 
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center gap-2"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar Datos"}
        </button>
      </div>
    </div>
  )
}