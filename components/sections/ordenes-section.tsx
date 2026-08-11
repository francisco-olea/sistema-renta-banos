"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { useAppState } from "@/lib/app-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Search, RefreshCcw } from "lucide-react"
import type { Orden, EstadoOrden, RutaNum, Frecuencia, TipoOrden } from "@/lib/data"

const MapLocationPicker = dynamic(
  () => import("@/components/map-location-picker").then((mod) => mod.MapLocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-lg border border-border bg-muted flex items-center justify-center text-sm text-muted-foreground">
        Cargando mapa...
      </div>
    ),
  }
)

const weekDays = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"] as const

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function parseFrecuencia(value: string | undefined) {
  if (!value) return [] as string[]

  const normalized = normalizeText(value)
  if (normalized.includes("todos los dias")) return [...weekDays]

  return weekDays.filter((day) => normalized.includes(normalizeText(day)))
}

function formatFrecuencia(days: string[]) {
  return days.join(", ")
}

function estadoBadge(estado: EstadoOrden) {
  switch (estado) {
    case "activo":
      return <Badge className="bg-status-listo/15 text-status-listo border-status-listo/25 hover:bg-status-listo/15">Activo</Badge>
    case "terminado":
      return <Badge className="bg-primary/15 text-primary border-primary/25 hover:bg-primary/15">Terminado</Badge>
    case "cancelado":
      return <Badge className="bg-status-cerrado/15 text-status-cerrado border-status-cerrado/25 hover:bg-status-cerrado/15">Cancelado</Badge>
  }
}

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCoordinate(value: unknown) {
  const numericValue = typeof value === "number" ? value : Number(value)
  return Number.isFinite(numericValue) ? numericValue.toFixed(6) : "-"
}

const emptyOrden: Omit<Orden, "id" | "created_at" | "updated_at"> = {
  cliente_id: 0,
  cliente_nombre: "",
  tipo: "Obra",
  estado: "activo",
  renta: 0,
  producto: "Baño Portátil Estándar",
  producto_nombres: [],
  cantidad: 1,
  ruta: 1,
  frecuencia: "Lunes",
  domicilio: "",
  map_lat: null,
  map_lng: null,
  fecha_inicio: new Date().toISOString().split("T")[0],
  fecha_fin: null,
  notas: "",
}

export function OrdenesSection() {
  const { ordenes, updateOrden, addOrden, clientes, productos, rutas, refreshRutasFromOrdenes, productoNombresAsignados } = useAppState()
  const [search, setSearch] = useState("")
  const [filterRuta, setFilterRuta] = useState<string>("todas")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [editOrder, setEditOrder] = useState<Orden | null>(null)
  const [newOrder, setNewOrder] = useState(false)
  const [form, setForm] = useState<Partial<Orden>>(emptyOrden)
  const [assignedSelection, setAssignedSelection] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [justUpdated, setJustUpdated] = useState(false)

  const rutasDisponibles = useMemo(() => Array.from(new Set(rutas)).sort((a, b) => a - b), [rutas])

  const filtered = useMemo(() => {
    return ordenes.filter((o) => {
      if (filterRuta !== "todas" && o.ruta !== Number(filterRuta)) return false
      if (filterEstado !== "todos" && o.estado !== filterEstado) return false
      if (!search) return true
      const s = search.toLowerCase()
      return (
        o.cliente_nombre.toLowerCase().includes(s) ||
        String(o.id).includes(s) ||
        o.domicilio.toLowerCase().includes(s)
      )
    }).sort((a, b) => b.id - a.id)
  }, [ordenes, search, filterRuta, filterEstado])

  const openNew = () => {
    setNewOrder(true)
    setEditOrder(null)
    setForm({ ...emptyOrden, ruta: (rutasDisponibles[0] ?? 1) as RutaNum })
  }

  const openEdit = (o: Orden) => {
    const producto = productos.find((p) => p.nombre === o.producto)
    const names = o.producto_nombres?.filter((name) => name.trim() !== "") ?? []
    const seleccion = names.length > 0 ? names : producto ? productoNombresAsignados[producto.id] ?? [] : []
    setEditOrder(o)
    setNewOrder(false)
    setForm({ ...o, map_lat: o.map_lat ?? null, map_lng: o.map_lng ?? null })
    setAssignedSelection(Array.from({ length: o.cantidad ?? 1 }, (_, index) => seleccion[index] ?? ""))
  }

  const save = () => {
    if (!isAssignmentReady) return

    if (newOrder) {
      addOrden(form as Omit<Orden, "id" | "created_at" | "updated_at">)
      setNewOrder(false)
    } else if (editOrder) {
      updateOrden(editOrder.id, form)
      setEditOrder(null)
    }
  }

  const closeDialog = () => {
    setEditOrder(null)
    setNewOrder(false)
  }

  const isOpen = !!editOrder || newOrder

  const selectedProduct = useMemo(
    () => productos.find((p) => p.nombre === form.producto),
    [form.producto, productos]
  )

  const selectedProductNames = useMemo(() => {
    const nombres = selectedProduct ? productoNombresAsignados[selectedProduct.id] ?? [] : []
    return nombres.filter((name) => name.trim() !== "")
  }, [selectedProduct, productoNombresAsignados])

  const availableNamesCount = selectedProductNames.length
  const requiredNamesCount = Number(form.cantidad ?? 1)
  const isAssignmentReady = availableNamesCount >= requiredNamesCount && assignedSelection.length === requiredNamesCount

  useEffect(() => {
    const max = requiredNamesCount
    setAssignedSelection((prev) => {
      const valid = prev.filter((name) => selectedProductNames.includes(name))
      if (valid.length <= max) return valid
      return valid.slice(0, max)
    })
  }, [requiredNamesCount, selectedProductNames])

  useEffect(() => {
    if (!isOpen) return
    if (newOrder) {
      setAssignedSelection(selectedProductNames.slice(0, requiredNamesCount))
    }
  }, [isOpen, newOrder, selectedProductNames, requiredNamesCount])

  const handleSlotSelection = (slotIndex: number, name: string) => {
    const next = [...assignedSelection]
    next[slotIndex] = name
    setAssignedSelection(next)
    setForm((prev) => ({ ...prev, producto_nombres: next.filter((item) => item.trim() !== "") }))
  }

  const handleProductChange = (valor: string) => {
    const currentQuantity = Number(form.cantidad ?? 1) || 1
    const producto = productos.find((p) => p.nombre === valor)
    const nombres = producto ? productoNombresAsignados[producto.id] ?? [] : []
    const nextSelection = nombres.filter((name) => name.trim() !== "").slice(0, currentQuantity)
    while (nextSelection.length < currentQuantity) {
      nextSelection.push("")
    }
    setForm((prev) => ({ ...prev, producto: valor, producto_nombres: nextSelection.filter((item) => item.trim() !== "") }))
    setAssignedSelection(nextSelection)
  }

  const handleQuantityChange = (cantidad: number) => {
    const nextCantidad = Number(cantidad) || 1
    setForm((prev) => ({ ...prev, cantidad: nextCantidad, producto_nombres: assignedSelection.slice(0, nextCantidad).filter((item) => item.trim() !== "") }))
    setAssignedSelection((prev) => {
      const next = prev.slice(0, nextCantidad)
      while (next.length < nextCantidad) {
        next.push("")
      }
      return next
    })
  }

  const handleRefresh = () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    refreshRutasFromOrdenes()

    window.setTimeout(() => {
      setIsRefreshing(false)
      setJustUpdated(true)
      window.setTimeout(() => setJustUpdated(false), 1100)
    }, 320)
  }

  useEffect(() => {
    if (filterRuta !== "todas" && !rutasDisponibles.includes(Number(filterRuta))) {
      setFilterRuta("todas")
    }
  }, [filterRuta, rutasDisponibles])

  useEffect(() => {
    if (!isOpen) return
    if (rutasDisponibles.length === 0) return

    const rutaActual = Number(form.ruta ?? rutasDisponibles[0] ?? 1)
    if (!rutasDisponibles.includes(rutaActual)) {
      setForm((prev) => ({ ...prev, ruta: (rutasDisponibles[0] ?? 1) as RutaNum }))
    }
  }, [form.ruta, isOpen, rutasDisponibles])

  const selectedDays = parseFrecuencia(form.frecuencia)

  const toggleFrequencyDay = (day: string) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter((selectedDay) => selectedDay !== day)
      : [...selectedDays, day]

    setForm({ ...form, frecuencia: formatFrecuencia(nextDays) as Frecuencia })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Ordenes</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestiona las ordenes de renta</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nueva Orden
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por ID, cliente o domicilio..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="terminado">Terminado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRuta} onValueChange={setFilterRuta}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filtrar por ruta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las rutas</SelectItem>
                {rutasDisponibles.map((r) => (
                  <SelectItem key={r} value={String(r)}>Ruta {r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="secondary"
              onClick={handleRefresh}
              className={
                `transition-all duration-200 active:scale-95 sm:self-start ${
                  justUpdated
                    ? "bg-emerald-600/15 text-emerald-700 border border-emerald-300 shadow-sm"
                    : "hover:-translate-y-0.5 hover:shadow-md"
                }`
              }
            >
              <RefreshCcw className={`h-4 w-4 mr-1.5 ${isRefreshing ? "animate-spin" : justUpdated ? "animate-pulse" : ""}`} />
              {isRefreshing ? "Actualizando..." : justUpdated ? "Actualizado" : "Actualizar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden lg:table-cell">Renta</TableHead>
                <TableHead className="hidden md:table-cell">Producto</TableHead>
                <TableHead className="hidden lg:table-cell">Cant.</TableHead>
                <TableHead className="hidden sm:table-cell">Ruta</TableHead>
                <TableHead className="hidden xl:table-cell">Frecuencia</TableHead>
                <TableHead className="hidden xl:table-cell">Inicio</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">No se encontraron ordenes</TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="font-medium max-w-[180px] truncate">{o.cliente_nombre}</TableCell>
                    <TableCell className="hidden md:table-cell">{o.tipo}</TableCell>
                    <TableCell>{estadoBadge(o.estado)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatMXN(o.renta)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{o.producto}</TableCell>
                    <TableCell className="hidden lg:table-cell text-center">{o.cantidad}</TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge variant="outline">{o.ruta}</Badge></TableCell>
                    <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{o.frecuencia}</TableCell>
                    <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{o.fecha_inicio}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(o)} aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{newOrder ? "Nueva Orden" : `Editar Orden #${editOrder?.id}`}</DialogTitle>
            <DialogDescription>
              Completa o actualiza la informacion de la orden, incluyendo cliente, ruta, frecuencia y ubicacion en mapa.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Cliente</label>
                <Select
                  value={String(form.cliente_id)}
                  onValueChange={(v) => {
                    const c = clientes.find((cl) => cl.id === Number(v))
                    if (c) setForm({ ...form, cliente_id: c.id, cliente_nombre: c.nombre, domicilio: c.domicilio })
                  }}
                >
                  <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as TipoOrden })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Obra">Obra</SelectItem>
                    <SelectItem value="Evento">Evento</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Estado</label>
                <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v as EstadoOrden })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="terminado">Terminado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Renta (MXN)</label>
                <Input type="number" step="1" value={form.renta ?? ""} onChange={(e) => setForm({ ...form, renta: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Producto</label>
                <Select value={form.producto} onValueChange={handleProductChange}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {productos.map((p) => (
                      <SelectItem key={p.id} value={p.nombre}>{p.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Cantidad</label>
                <Input type="number" value={form.cantidad ?? ""} onChange={(e) => handleQuantityChange(Number(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Nombres asignados</label>
                <div className="rounded-lg border border-border bg-background p-3">
                  {selectedProduct ? (
                    selectedProductNames.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {Array.from({ length: requiredNamesCount }, (_, slotIndex) => (
                          <div key={slotIndex} className="rounded-lg border border-border bg-surface p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium">Asignación {slotIndex + 1}</span>
                              <span className="text-xs text-muted-foreground">
                                {assignedSelection[slotIndex] || "Sin seleccionar"}
                              </span>
                            </div>
                            <Select
                              value={assignedSelection[slotIndex] ?? ""}
                              onValueChange={(value) => handleSlotSelection(slotIndex, value)}
                            >
                              <SelectTrigger className="w-full mt-3">
                                <SelectValue placeholder="Elegir nombre" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedProductNames.map((name) => (
                                  <SelectItem key={`${slotIndex}-${name}`} value={name}>{name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No hay nombres asignados para este producto. Ve a Asignar Productos para registrar etiquetas.</p>
                    )
                  ) : (
                    <p className="text-xs text-muted-foreground">Selecciona un producto para ver los nombres asignados.</p>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {selectedProduct ? (
                      selectedProductNames.length < requiredNamesCount ? (
                        `Faltan ${requiredNamesCount - selectedProductNames.length} nombres asignados para este producto.`
                      ) : assignedSelection.some((value) => !value) ? (
                        `Selecciona ${requiredNamesCount - assignedSelection.filter(Boolean).length} nombres para esta orden.`
                      ) : (
                        `Asignacion completa: ${requiredNamesCount} nombres seleccionados.`
                      )
                    ) : (
                      "Selecciona un producto para ver los nombres asignados."
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Ruta</label>
                <Select value={String(form.ruta)} onValueChange={(v) => setForm({ ...form, ruta: Number(v) as RutaNum })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {rutasDisponibles.map((r) => (
                      <SelectItem key={r} value={String(r)}>Ruta {r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Frecuencia</label>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                {weekDays.map((day) => {
                  const isSelected = selectedDays.includes(day)

                  return (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">{day.charAt(0)}</span>
                      <Button
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className="h-10 w-full min-w-0 px-0"
                        aria-label={day}
                        onClick={() => toggleFrequencyDay(day)}
                      >
                        <span className="sr-only">{day}</span>
                      </Button>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedDays.length > 0 ? `Dias seleccionados: ${formatFrecuencia(selectedDays)}` : "Selecciona uno o mas dias para el servicio."}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Domicilio</label>
              <Input value={form.domicilio ?? ""} onChange={(e) => setForm({ ...form, domicilio: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium">Ubicacion en mapa</label>
                {(form.map_lat != null && form.map_lng != null) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm({ ...form, map_lat: null, map_lng: null })}
                  >
                    Limpiar pin
                  </Button>
                )}
              </div>
              <MapLocationPicker
                lat={form.map_lat ?? null}
                lng={form.map_lng ?? null}
                onChange={(lat, lng) => setForm({ ...form, map_lat: lat, map_lng: lng })}
              />
              <p className="text-xs text-muted-foreground">
                Haz clic en el mapa para colocar el pin de la ubicacion asignada.
              </p>
              <p className="text-xs text-muted-foreground">
                Lat: {formatCoordinate(form.map_lat)} | Lng: {formatCoordinate(form.map_lng)}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Fecha Inicio</label>
                <Input type="date" value={form.fecha_inicio ?? ""} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Fecha Fin</label>
                <Input type="date" value={form.fecha_fin ?? ""} onChange={(e) => setForm({ ...form, fecha_fin: e.target.value || null })} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Notas</label>
              <Input value={form.notas ?? ""} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button onClick={save} disabled={!isAssignmentReady}>{newOrder ? "Crear" : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
