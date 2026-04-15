"use client"

import { useState } from "react"
import { AppSidebar, MobileHeader, type Section } from "@/components/app-sidebar"
import { PanelSection } from "@/components/sections/panel-section"
import { OrdenesSection } from "@/components/sections/ordenes-section"
import { RutasSection } from "@/components/sections/rutas-section"
import { CajaSection } from "@/components/sections/caja-section"
import { ClientesSection } from "@/components/sections/clientes-section"
import { ProductosSection } from "@/components/sections/productos-section"
import { ReportesSection } from "@/components/sections/reportes-section"

const sectionLabels: Record<Section, string> = {
  panel: "Panel",
  ordenes: "Ordenes",
  rutas: "Rutas",
  caja: "Caja",
  clientes: "Clientes",
  productos: "Productos",
  reportes: "Reportes",
}

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState<Section>("panel")
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (section: Section) => {
    setActiveSection(section)
  }

  const renderSection = () => {
    switch (activeSection) {
      case "panel":
        return <PanelSection />
      case "ordenes":
        return <OrdenesSection />
      case "rutas":
        return <RutasSection />
      case "caja":
        return <CajaSection />
      case "clientes":
        return <ClientesSection />
      case "productos":
        return <ProductosSection />
      case "reportes":
        return <ReportesSection />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        active={activeSection}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader
          onOpen={() => setMobileOpen(true)}
          title={sectionLabels[activeSection]}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
