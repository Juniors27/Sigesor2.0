"use client"

import { useState } from "react"
import Header from "@/components/Header.jsx"
import Sidebar from "@/components/SiderBar.jsx"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <div className={`${sidebarOpen ? "block" : "hidden"} shrink-0`}>
          <Sidebar />
        </div>

        <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),_transparent_40%),linear-gradient(180deg,_#020817_0%,_#0f172a_100%)]">
          {children}
        </main>
      </div>
    </div>
  )
}
