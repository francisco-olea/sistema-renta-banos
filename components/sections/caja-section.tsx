"use client"

import { useState, useMemo } from "react"
import { useAppState } from "@/lib/app-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Search, DollarSign, CreditCard, Banknote } from "lucide-react"
import type { Pago } from "@/lib/data"

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
}

function estatusPagoBadge(estatus: Pago["estatus"]) {
  switch (estatus) {
    case "pagado":
      return <Badge className="bg-emerald-600/15 text-emerald-700 border-emerald-200 hover:bg-emerald-600/15">Pagado</Badge>
    case "pendiente":
      return <Badge className="bg-amber-600/15 text-amber-700 border-amber-200 hover:bg-amber-600/15">Pendiente</Badge>
    case "vencido":
      return <Badge className="bg-red-600/15 text-red-700 border-red-200 hover:bg-red-600/15">Vencido</Badge>
  }
}

export function CajaSection() {
  const { pagos, addPago, ordenes } = useAppState()
  const [search, setSearch] = useState("")
  const [filterEstatus, setFilterEstatus] = useState("todos")
  const [newPago, setNewPago] = useState(false)
  const [form, setForm] = useState<Partial<Pago>>({
    orden_id: 0,
    cliente_nombre: "",
    monto: 0,
    metodo: "Efectivo",
    fecha: new Date().toISOString().split("T")[0],
    concepto: "",
    estatus: "pagado",
  })

  const filtered = useMemo(() => {
    return pagos.filter((p) => {
      if (search && !p.cliente_nombre.toLowerCase().includes(search.toLowerCase()) && !String(p.orden_id).includes(search)) return false
      if (filterEstatus !== "todos" && p.estatus !== filterEstatus) return false
      return true
    }).sort((a, b) => b.fecha.localeCompare(a.fecha))
  }, [pagos, search, filterEstatus])

  const stats = useMemo(() => {
    const totalPagado = pagos.filter((p) => p.estatus === "pagado").reduce((s, p) => s + p.monto, 0)
    const totalPendiente = pagos.filter((p) => p.estatus === "pendiente").reduce((s, p) => s + p.monto, 0)
    return { totalPagado, totalPendiente, totalPagos: pagos.length }
  }, [pagos])

  const savePago = () => {
    if (form.orden_id && form.monto) {
      addPago(form as Omit<Pago, "id">)
      setNewPago(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Caja</h2>
          <p className="text-sm text-muted-foreground mt-1">Control de pagos y cobros</p>
        </div>
        <Button onClick={() => setNewPago(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Registrar Pago
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cobrado</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatMXN(stats.totalPagado)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendiente</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatMXN(stats.totalPendiente)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pagos</CardTitle>
            <Banknote className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.totalPagos}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por cliente u orden..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterEstatus} onValueChange={setFilterEstatus}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Estatus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead className="hidden sm:table-cell">Metodo</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="hidden lg:table-cell">Concepto</TableHead>
                <TableHead>Estatus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No se encontraron pagos</TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell className="font-mono text-xs">{p.orden_id}</TableCell>
                    <TableCell className="font-medium max-w-[150px] truncate">{p.cliente_nombre}</TableCell>
                    <TableCell className="font-semibold">{formatMXN(p.monto)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{p.metodo}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{p.fecha}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[150px] truncate">{p.concepto}</TableCell>
                    <TableCell>{estatusPagoBadge(p.estatus)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={newPago} onOpenChange={setNewPago}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Orden</label>
              <Select
                value={String(form.orden_id)}
                onValueChange={(v) => {
                  const o = ordenes.find((ord) => ord.id === Number(v))
                  if (o) setForm({ ...form, orden_id: o.id, cliente_nombre: o.cliente_nombre, monto: o.renta })
                }}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar orden" /></SelectTrigger>
                <SelectContent>
                  {ordenes.filter((o) => o.estado === "activo").map((o) => (
                    <SelectItem key={o.id} value={String(o.id)}>#{o.id} - {o.cliente_nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Monto (MXN)</label>
                <Input type="number" value={form.monto ?? ""} onChange={(e) => setForm({ ...form, monto: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Metodo</label>
                <Select value={form.metodo} onValueChange={(v) => setForm({ ...form, metodo: v as Pago["metodo"] })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Fecha</label>
                <Input type="date" value={form.fecha ?? ""} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Estatus</label>
                <Select value={form.estatus} onValueChange={(v) => setForm({ ...form, estatus: v as Pago["estatus"] })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pagado">Pagado</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Concepto</label>
              <Input value={form.concepto ?? ""} onChange={(e) => setForm({ ...form, concepto: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPago(false)}>Cancelar</Button>
            <Button onClick={savePago}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
