"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

export default function DateRangePicker({ onRangeChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoverDate, setHoverDate] = useState(null)
  const calendarRef = useRef(null)

  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const displayValue = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`
    } else if (startDate) {
      return formatDate(startDate)
    }
    return "Seleccionar fechas..."
  }

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
    } else {
      if (date < startDate) {
        setEndDate(startDate)
        setStartDate(date)
      } else {
        setEndDate(date)
      }
    }
  }

  const isDateInRange = (date) => {
    if (startDate && !endDate && hoverDate) {
      return date >= startDate && date <= hoverDate
    }
    return startDate && endDate && date >= startDate && date <= endDate
  }

  const isStartDate = (date) => {
    return startDate && date.toDateString() === startDate.toDateString()
  }

  const isEndDate = (date) => {
    return endDate && date.toDateString() === endDate.toDateString()
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []
    const monthName = currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })

    // Header with month name and navigation
    days.push(
      <div key="header" className="flex justify-between items-center mb-2 px-1">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-700 rounded">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-medium">{monthName}</div>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-700 rounded">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>,
    )

    // Days of week
    const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
    days.push(
      <div key="weekdays" className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>,
    )

    // Calendar grid
    const calendarDays = []

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-8"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = new Date().toDateString() === date.toDateString()
      const inRange = isDateInRange(date)
      const isStart = isStartDate(date)
      const isEnd = isEndDate(date)

      calendarDays.push(
        <button
          key={day}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isToday ? "border border-blue-500" : ""}
            ${inRange ? "bg-blue-600/20" : ""}
            ${isStart || isEnd ? "bg-blue-600 text-white" : "hover:bg-gray-700"}
          `}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => {
            if (startDate && !endDate) {
              setHoverDate(date)
            }
          }}
        >
          {day}
        </button>,
      )
    }

    days.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>,
    )

    return days
  }

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Notify parent component when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      // Usamos una función de referencia para evitar el bucle infinito
      const range = { startDate, endDate }
      onRangeChange(range)
    }
  }, [startDate, endDate]) // Eliminamos onRangeChange de las dependencias

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{displayValue()}</span>
      </div>

      {isOpen && (
        <div
          ref={calendarRef}
          className="absolute z-50 mt-1 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
        >
          {renderCalendar()}

          <div className="mt-3 flex justify-between">
            <button
              className="text-xs text-gray-400 hover:text-white"
              onClick={() => {
                setStartDate(null)
                setEndDate(null)
              }}
            >
              Limpiar
            </button>

            <button
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
              onClick={() => {
                if (startDate) {
                  if (endDate) {
                    onRangeChange({ startDate, endDate })
                  } else {
                    // Si solo hay fecha de inicio, usarla como fecha de fin también
                    onRangeChange({ startDate, endDate: startDate })
                  }
                  setIsOpen(false)
                }
              }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
