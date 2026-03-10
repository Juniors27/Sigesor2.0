"use client"

import { useState } from "react"
import Header from "@/components/Header.jsx"
import Sidebar from "@/components/SiderBar.jsx"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <div className={`${sidebarOpen ? "block" : "hidden"}`}>
          <Sidebar />
        </div>

        <main className="flex-1 overflow-auto bg-gray-900">{children}</main>
      </div>
    </div>
  )
}
