"use client"

import { useState, useMemo } from "react"
import { useAppState } from "@/lib/app-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  DollarSign,
  Pencil,
  Search,
  X,
} from "lucide-react"
import type { Orden, EstadoOrden, RutaNum, Frecuencia, TipoOrden } from "@/lib/data"

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

export function PanelSection() {
  const { ordenes, updateOrden, clientes, productos, rutas } = useAppState()
  const [filterCliente, setFilterCliente] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [filterRuta, setFilterRuta] = useState<string>("todas")
  const [filterDomicilio, setFilterDomicilio] = useState("")
  const [editOrder, setEditOrder] = useState<Orden | null>(null)
  const [editForm, setEditForm] = useState<Partial<Orden>>({})

  const sorted = useMemo(() => {
    return [...ordenes].sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  }, [ordenes])

  const filtered = useMemo(() => {
    return sorted.filter((o) => {
      if (filterCliente && !o.cliente_nombre.toLowerCase().includes(filterCliente.toLowerCase())) return false
      if (filterEstado !== "todos" && o.estado !== filterEstado) return false
      if (filterRuta !== "todas" && o.ruta !== Number(filterRuta)) return false
      if (filterDomicilio && !o.domicilio.toLowerCase().includes(filterDomicilio.toLowerCase())) return false
      return true
    })
  }, [sorted, filterCliente, filterEstado, filterRuta, filterDomicilio])

  const stats = useMemo(() => {
    const ordenesActivas = ordenes.filter((o) => o.estado === "activo")
    const activos = ordenesActivas.length
    const terminados = ordenes.filter((o) => o.estado === "terminado").length
    const cancelados = ordenes.filter((o) => o.estado === "cancelado").length
    const totalRenta = ordenesActivas.reduce((sum, orden) => sum + Number(orden.renta || 0), 0)
    return { activos, terminados, cancelados, totalRenta }
  }, [ordenes])

  const openEdit = (order: Orden) => {
    setEditOrder(order)
    setEditForm({ ...order })
  }

  const saveEdit = () => {
    if (editOrder && editForm) {
      updateOrden(editOrder.id, editForm)
      setEditOrder(null)
    }
  }

  const clearFilters = () => {
    setFilterCliente("")
    setFilterEstado("todos")
    setFilterRuta("todas")
    setFilterDomicilio("")
  }

  const hasFilters = filterCliente || filterEstado !== "todos" || filterRuta !== "todas" || filterDomicilio

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">Resumen de rentas actualizadas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
            <ClipboardList className="h-4 w-4 text-status-listo" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.activos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terminados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.terminados}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelados</CardTitle>
            <XCircle className="h-4 w-4 text-status-cerrado" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.cancelados}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Renta Activa</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatMXN(stats.totalRenta)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={filterCliente}
                  onChange={(e) => setFilterCliente(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="terminado">Terminado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRuta} onValueChange={setFilterRuta}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ruta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las rutas</SelectItem>
                  {rutas.map((ruta) => (
                    <SelectItem key={ruta} value={String(ruta)}>Ruta {ruta}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar domicilio..."
                  value={filterDomicilio}
                  onChange={(e) => setFilterDomicilio(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {hasFilters && (
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  <X className="h-3.5 w-3.5 mr-1" />
                  Limpiar filtros
                </Button>
                <span className="text-xs text-muted-foreground ml-2">
                  {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
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
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No se encontraron resultados
                  </TableCell>
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
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{o.ruta}</Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{o.frecuencia}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(o)} aria-label="Editar orden">
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

      {/* Edit dialog */}
      <Dialog open={!!editOrder} onOpenChange={(open) => !open && setEditOrder(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Orden #{editOrder?.id}</DialogTitle>
            <DialogDescription>
              Modifica cliente, estado, ruta, producto y fechas de la orden seleccionada.
            </DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Cliente</label>
                  <Select
                    value={String(editForm.cliente_id)}
                    onValueChange={(v) => {
                      const c = clientes.find((cl) => cl.id === Number(v))
                      if (c) setEditForm({ ...editForm, cliente_id: c.id, cliente_nombre: c.nombre })
                    }}
                  >
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={editForm.tipo} onValueChange={(v) => setEditForm({ ...editForm, tipo: v as TipoOrden })}>
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
                  <Select value={editForm.estado} onValueChange={(v) => setEditForm({ ...editForm, estado: v as EstadoOrden })}>
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
                  <Input type="number" value={editForm.renta ?? ""} onChange={(e) => setEditForm({ ...editForm, renta: Number(e.target.value) })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Producto</label>
                  <Select value={editForm.producto} onValueChange={(v) => setEditForm({ ...editForm, producto: v })}>
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
                  <Input type="number" value={editForm.cantidad ?? ""} onChange={(e) => setEditForm({ ...editForm, cantidad: Number(e.target.value) })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Ruta</label>
                  <Select value={String(editForm.ruta)} onValueChange={(v) => setEditForm({ ...editForm, ruta: Number(v) as RutaNum })}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {rutas.map((ruta) => (
                        <SelectItem key={ruta} value={String(ruta)}>Ruta {ruta}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Frecuencia</label>
                  <Select value={editForm.frecuencia} onValueChange={(v) => setEditForm({ ...editForm, frecuencia: v as Frecuencia })}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos los dias">Todos los dias</SelectItem>
                      <SelectItem value="Lunes y Miercoles">Lunes y Miercoles</SelectItem>
                      <SelectItem value="Martes y Jueves">Martes y Jueves</SelectItem>
                      <SelectItem value="Lunes, Miercoles y Viernes">L, M, V</SelectItem>
                      <SelectItem value="Solo Sabados">Solo Sabados</SelectItem>
                      <SelectItem value="Semanal">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Domicilio</label>
                <Input value={editForm.domicilio ?? ""} onChange={(e) => setEditForm({ ...editForm, domicilio: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Notas</label>
                <Input value={editForm.notas ?? ""} onChange={(e) => setEditForm({ ...editForm, notas: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOrder(null)}>Cancelar</Button>
            <Button onClick={saveEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
