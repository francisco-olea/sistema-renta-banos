"use client"

import { useState, useMemo } from "react"
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Search } from "lucide-react"
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
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
}

const emptyOrden: Omit<Orden, "id" | "created_at" | "updated_at"> = {
  cliente_id: 0,
  cliente_nombre: "",
  tipo: "Obra",
  estado: "activo",
  renta: 0,
  producto: "Baño Portátil Estándar",
  cantidad: 1,
  ruta: 1,
  frecuencia: "Lunes y Miércoles",
  domicilio: "",
  fecha_inicio: new Date().toISOString().split("T")[0],
  fecha_fin: null,
  notas: "",
}

export function OrdenesSection() {
  const { ordenes, updateOrden, addOrden, clientes, productos } = useAppState()
  const [search, setSearch] = useState("")
  const [editOrder, setEditOrder] = useState<Orden | null>(null)
  const [newOrder, setNewOrder] = useState(false)
  const [form, setForm] = useState<Partial<Orden>>(emptyOrden)

  const filtered = useMemo(() => {
    if (!search) return ordenes
    const s = search.toLowerCase()
    return ordenes.filter(
      (o) =>
        o.cliente_nombre.toLowerCase().includes(s) ||
        String(o.id).includes(s) ||
        o.domicilio.toLowerCase().includes(s)
    )
  }, [ordenes, search])

  const openNew = () => {
    setNewOrder(true)
    setEditOrder(null)
    setForm({ ...emptyOrden })
  }

  const openEdit = (o: Orden) => {
    setEditOrder(o)
    setNewOrder(false)
    setForm({ ...o })
  }

  const save = () => {
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
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por ID, cliente o domicilio..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                <Input type="number" value={form.renta ?? ""} onChange={(e) => setForm({ ...form, renta: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Producto</label>
                <Select value={form.producto} onValueChange={(v) => setForm({ ...form, producto: v })}>
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
                <Input type="number" value={form.cantidad ?? ""} onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Ruta</label>
                <Select value={String(form.ruta)} onValueChange={(v) => setForm({ ...form, ruta: Number(v) as RutaNum })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ruta 1</SelectItem>
                    <SelectItem value="2">Ruta 2</SelectItem>
                    <SelectItem value="3">Ruta 3</SelectItem>
                    <SelectItem value="4">Ruta 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Frecuencia</label>
                <Select value={form.frecuencia} onValueChange={(v) => setForm({ ...form, frecuencia: v as Frecuencia })}>
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
              <Input value={form.domicilio ?? ""} onChange={(e) => setForm({ ...form, domicilio: e.target.value })} />
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
            <Button onClick={save}>{newOrder ? "Crear" : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
