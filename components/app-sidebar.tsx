"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  ClipboardList,
  Route,
  Wallet,
  Users,
  Package,
  FileBarChart,
  LogOut,
  Bubbles,
  Menu,
} from "lucide-react"

export type Section =
  | "panel"
  | "ordenes"
  | "rutas"
  | "caja"
  | "clientes"
  | "productos"
  | "reportes"

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "panel", label: "Panel", icon: LayoutDashboard },
  { id: "ordenes", label: "Ordenes", icon: ClipboardList },
  { id: "rutas", label: "Rutas", icon: Route },
  { id: "caja", label: "Caja", icon: Wallet },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "productos", label: "Productos", icon: Package },
  { id: "reportes", label: "Reportes", icon: FileBarChart },
]

interface SidebarProps {
  active: Section
  onNavigate: (s: Section) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

function NavContent({ active, onNavigate, onClose }: { active: Section; onNavigate: (s: Section) => void; onClose?: () => void }) {
  const { logout, user } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Bubbles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground leading-tight">SaniMod</span>
          <span className="text-xs text-muted-foreground">Gestion de Renta</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id)
                onClose?.()
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full text-left",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {user?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-sidebar-foreground">{user}</span>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
          Cerrar Sesion
        </button>
      </div>
    </div>
  )
}

export function AppSidebar({ active, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0 shrink-0">
        <NavContent active={active} onNavigate={onNavigate} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de Navegacion</SheetTitle>
          </SheetHeader>
          <NavContent active={active} onNavigate={onNavigate} onClose={onMobileClose} />
        </SheetContent>
      </Sheet>
    </>
  )
}

export function MobileHeader({ onOpen, title }: { onOpen: () => void; title: string }) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden sticky top-0 z-40">
      <Button variant="ghost" size="icon" onClick={onOpen} aria-label="Abrir menu">
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
    </header>
  )
}
