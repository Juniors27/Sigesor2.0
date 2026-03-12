"use client"

import { useEffect, useMemo, useState } from "react"

import { getDashboardStats } from "@/services/dashboard.service"

export default function useDashboardStats() {
  const [stats, setStats] = useState({
    extemporaneos: 0,
    observados: 0,
    reconsideracion: 0,
    pcpp: 0,
    fissal: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getDashboardStats()

      setStats({
        extemporaneos: data.extemporaneos || 0,
        observados: data.observados || 0,
        reconsideracion: data.reconsideracion || 0,
        pcpp: data.pcpp || 0,
        fissal: data.fissal || 0,
      })
    } catch (currentError) {
      console.error("Error fetching dashboard stats:", currentError)
      setError("Error al cargar las estadisticas del dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const totalRegistros = useMemo(
    () => stats.extemporaneos + stats.observados + stats.reconsideracion + stats.pcpp + stats.fissal,
    [stats]
  )

  return {
    stats,
    loading,
    error,
    totalRegistros,
    refreshDashboard: fetchDashboard,
  }
}
