"use client"

import { useEffect, useMemo, useState } from "react"

import { FILTER_TYPE_DATE, FILTER_TYPE_FUA, FILTER_TYPE_MONTH } from "@/components/features/bandeja-fua/bandejaFua.constants"
import { deleteTrayItem, getTrayAvailableDates, getTrayItems } from "@/services/trays.service"

function normalizeAvailableDates(items) {
  const grouped = {}
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  items.forEach((item) => {
    const [year, month] = item.fecha.split("-")
    const key = `${year}-${month}`

    if (!grouped[key]) {
      grouped[key] = {
        id: key,
        value: `${month}/${year.slice(-2)}`,
        label: `${monthNames[parseInt(month, 10) - 1]} ${year}`,
        count: 0,
      }
    }

    grouped[key].count += item.count
  })

  return Object.values(grouped).sort((a, b) => b.id.localeCompare(a.id))
}

export default function useBandejaFua(type) {
  const [filterType, setFilterType] = useState(FILTER_TYPE_MONTH)
  const [filterValue, setFilterValue] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [fuaRenipress, setFuaRenipress] = useState("5196")
  const [fuaLote, setFuaLote] = useState("")
  const [fuaNumero, setFuaNumero] = useState("")
  const [fuas, setFuas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fechasDisponibles, setFechasDisponibles] = useState([])
  const [loadingFechas, setLoadingFechas] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [fuaToDelete, setFuaToDelete] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [fuaToEdit, setFuaToEdit] = useState(null)

  const fetchAvailableDates = async () => {
    setLoadingFechas(true)
    try {
      const data = await getTrayAvailableDates(type)
      setFechasDisponibles(normalizeAvailableDates(data))
    } catch (currentError) {
      console.error("Error fetching fechas disponibles:", currentError)
      setFechasDisponibles([])
    } finally {
      setLoadingFechas(false)
    }
  }

  const fetchFuas = async (filters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const responseData = await getTrayItems(type, filters)
      setFuas(responseData.results && responseData.count !== undefined ? responseData.results : responseData)
    } catch (currentError) {
      setError(currentError.message)
      console.error("Error fetching FUAs:", currentError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFuas()
    fetchAvailableDates()
  }, [])

  useEffect(() => {
    setFilterValue("")
    setFuaLote("")
    setFuaNumero("")
  }, [filterType])

  const confirmDelete = async () => {
    const id = fuaToDelete

    try {
      await deleteTrayItem(type, id)
      setFuas((currentFuas) => currentFuas.filter((fua) => fua.id !== id))
      alert(`FUA ${id} eliminado correctamente`)
    } catch (currentError) {
      alert(`Error al eliminar: ${currentError.message}`)
      console.error("Error deleting FUA:", currentError)
    } finally {
      setShowModal(false)
      setFuaToDelete(null)
    }
  }

  const handleFilter = () => {
    fetchFuas({
      filterType,
      filterValue,
      dateRange,
      fuaRenipress,
      fuaLote,
      fuaNumero,
    })
  }

  const filterOptions = useMemo(() => [FILTER_TYPE_MONTH, FILTER_TYPE_DATE, FILTER_TYPE_FUA], [])

  return {
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
    setShowModal,
    fuaToDelete,
    showEditModal,
    setShowEditModal,
    fuaToEdit,
    setFuaToEdit,
    filterOptions,
    fetchFuas,
    handleFilter,
    handleDeleteFua: (id) => {
      setFuaToDelete(id)
      setShowModal(true)
    },
    handleEditRow: (fuaData) => {
      setFuaToEdit(fuaData)
      setShowEditModal(true)
    },
    cancelDelete: () => {
      setShowModal(false)
      setFuaToDelete(null)
    },
    confirmDelete,
  }
}


