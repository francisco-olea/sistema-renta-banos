"use client"

import { useState } from "react"
import { useAppState } from "@/lib/app-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil } from "lucide-react"
import type { ProductoItem } from "@/lib/data"

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function parseOptionalNumber(value: string) {
  return value === "" ? undefined : Number(value)
}

function displayValue(value: string | number | undefined) {
  return value === undefined || value === "" ? "-" : value
}

export function ProductosSection() {
  const { productos, addProducto, updateProducto } = useAppState()
  const [editProducto, setEditProducto] = useState<ProductoItem | null>(null)
  const [newProducto, setNewProducto] = useState(false)
  const [form, setForm] = useState<Partial<ProductoItem>>({
    nombre: "", descripcion: "", precio_renta: 0, stock: 0, activo: true, color: "", notas: "",
  })

  const openNew = () => {
    setNewProducto(true)
    setEditProducto(null)
    setForm({ nombre: "", descripcion: "", precio_renta: 0, stock: 0, activo: true, color: "", notas: "" })
  }

  const openEdit = (p: ProductoItem) => {
    setEditProducto(p)
    setNewProducto(false)
    setForm({ ...p })
  }

  const save = () => {
    if (newProducto) {
      addProducto(form as Omit<ProductoItem, "id">)
      setNewProducto(false)
    } else if (editProducto) {
      updateProducto(editProducto.id, form)
      setEditProducto(null)
    }
  }

  const closeDialog = () => { setEditProducto(null); setNewProducto(false) }
  const isOpen = !!editProducto || newProducto

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Productos</h2>
          <p className="text-sm text-muted-foreground mt-1">Catalogo de productos disponibles para renta</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell className="min-w-[220px] text-xs text-muted-foreground">{p.descripcion}</TableCell>
                  <TableCell>{displayValue(p.color)}</TableCell>
                  <TableCell className="min-w-[180px] text-xs text-muted-foreground">{displayValue(p.notas)}</TableCell>
                  <TableCell className="font-semibold">{formatMXN(p.precio_renta)}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    {p.activo ? (
                      <Badge className="bg-emerald-600/15 text-emerald-700 border-emerald-200 hover:bg-emerald-600/15">Activo</Badge>
                    ) : (
                      <Badge variant="outline">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{newProducto ? "Nuevo Producto" : `Editar Producto #${editProducto?.id}`}</DialogTitle>
            <DialogDescription>
              Configura nombre, precio, stock y caracteristicas del producto.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Nombre</label>
              <Input value={form.nombre ?? ""} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Descripcion</label>
              <Input value={form.descripcion ?? ""} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Color</label>
                <Input value={form.color ?? ""} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Precio Renta (MXN)</label>
                <Input type="number" step="1" value={form.precio_renta ?? ""} onChange={(e) => setForm({ ...form, precio_renta: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" value={form.stock ?? ""} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Eje</label>
                <Input value={form.eje ?? ""} onChange={(e) => setForm({ ...form, eje: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Medida</label>
                <Input value={form.medida ?? ""} onChange={(e) => setForm({ ...form, medida: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tanques</label>
                <Input type="number" value={form.tanques ?? ""} onChange={(e) => setForm({ ...form, tanques: parseOptionalNumber(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Agua</label>
                <Input type="number" value={form.agua ?? ""} onChange={(e) => setForm({ ...form, agua: parseOptionalNumber(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Drenaje</label>
                <Input type="number" value={form.drenaje ?? ""} onChange={(e) => setForm({ ...form, drenaje: parseOptionalNumber(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tablones</label>
                <Input type="number" value={form.tablones ?? ""} onChange={(e) => setForm({ ...form, tablones: parseOptionalNumber(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Ruedas</label>
                <Input type="number" value={form.ruedas ?? ""} onChange={(e) => setForm({ ...form, ruedas: parseOptionalNumber(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tiempo (dias)</label>
                <Input type="number" value={form.tiempo ?? ""} onChange={(e) => setForm({ ...form, tiempo: parseOptionalNumber(e.target.value) })} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Notas</label>
              <Textarea value={form.notas ?? ""} onChange={(e) => setForm({ ...form, notas: e.target.value })} rows={3} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Estado</label>
              <Select value={form.activo ? "true" : "false"} onValueChange={(v) => setForm({ ...form, activo: v === "true" })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button onClick={save}>{newProducto ? "Crear" : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getDefaultName(productoNombre: string, index: number) {
  const firstWord = productoNombre.split(" ")[0] || productoNombre
  return `${firstWord.toUpperCase()}-${String(index + 1).padStart(3, "0")}`
}

export function ProductosAsignarSection() {
  const { productos, productoNombresAsignados, updateProductoAsignaciones, ordenes } = useAppState()
  const [editProducto, setEditProducto] = useState<ProductoItem | null>(null)
  const [formNames, setFormNames] = useState<string[]>([])
  const [page, setPage] = useState(0)

  const openEdit = (producto: ProductoItem) => {
    const existingNames = productoNombresAsignados[producto.id] ?? []
    const names = Array.from({ length: producto.stock }, (_, index) => {
      const existing = existingNames[index]
      return existing?.trim() ? existing : getDefaultName(producto.nombre, index)
    })
    setFormNames(names)
    setEditProducto(producto)
    setPage(0)
  }

  const getAssignmentStatus = (name: string) => {
    const orden = ordenes.find((o) => o.producto_nombres?.includes(name))
    if (!orden) return "Disponible"
    return `${orden.cliente_nombre} - Orden #${orden.id}`
  }

  const saveNames = () => {
    if (!editProducto) return
    updateProductoAsignaciones(editProducto.id, formNames)
    setEditProducto(null)
  }

  const closeDialog = () => {
    setEditProducto(null)
  }

  const countAssigned = (producto: ProductoItem) => {
    return (productoNombresAsignados[producto.id] ?? []).filter((name) => name.trim() !== "").length
  }

  const itemsPerPage = 10
  const currentPage = editProducto ? Math.min(page, Math.max(0, Math.ceil(editProducto.stock / itemsPerPage) - 1)) : 0
  const pageCount = editProducto ? Math.ceil(editProducto.stock / itemsPerPage) : 0
  const pageStart = currentPage * itemsPerPage

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Asignar Productos</h2>
          <p className="text-sm text-muted-foreground mt-1">Asignar etiquetas o nombres a cada unidad disponible según el stock.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Asignados</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{countAssigned(p)} / {p.stock}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editProducto} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asignar nombres a unidades</DialogTitle>
            <DialogDescription>
              Edita los nombres de cada unidad según el stock disponible. Usa un formato como BAÑO-001 para cada unidad.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {editProducto ? (
              <>
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-3 text-sm font-medium text-foreground">
                    <span>Unidad {pageStart + 1} - {Math.min(pageStart + itemsPerPage, editProducto.stock)} de {editProducto.stock}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 0}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= pageCount - 1}
                        onClick={() => setPage((prev) => Math.min(prev + 1, pageCount - 1))}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
                {Array.from({ length: Math.min(itemsPerPage, editProducto.stock - pageStart) }, (_, index) => {
                  const itemIndex = pageStart + index
                  const status = getAssignmentStatus(formNames[itemIndex] ?? getDefaultName(editProducto.nombre, itemIndex))
                  return (
                    <div key={itemIndex} className="grid grid-cols-[auto_1fr] items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Unidad {itemIndex + 1}</span>
                          <Badge variant="secondary" className="text-xs">
                            {status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{status === "Disponible" ? "Disponible" : "Asignado"}</p>
                      </div>
                      <Input
                        value={formNames[itemIndex] ?? ""}
                        placeholder={`BAÑO-${String(itemIndex + 1).padStart(3, "0")}`}
                        onChange={(e) => {
                          const next = [...formNames]
                          next[itemIndex] = e.target.value
                          setFormNames(next)
                        }}
                      />
                    </div>
                  )
                })}
              </>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button onClick={saveNames}>Guardar Asignaciones</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
