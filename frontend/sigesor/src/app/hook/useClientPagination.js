"use client"

import { useEffect, useState } from "react"

export default function useClientPagination(items, initialPageSize = 10) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedItems = items.slice(startIndex, endIndex)

  const setPageSize = (newSize) => {
    setPageSizeState(newSize)
    setPage(1)
  }

  const resetPagination = () => {
    setPage(1)
  }

  const getPageNumbers = () => {
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = [1]
    let startPage = Math.max(2, page - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3)

    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1)
    }

    if (endPage === totalPages - 1) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 2)
    }

    if (startPage > 2) {
      pages.push("...")
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages - 1) {
      pages.push("...")
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    setPage,
    setPageSize,
    resetPagination,
    getPageNumbers,
  }
}
