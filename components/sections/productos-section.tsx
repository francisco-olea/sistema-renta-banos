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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil } from "lucide-react"
import type { ProductoItem } from "@/lib/data"

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
}

export function ProductosSection() {
  const { productos, addProducto, updateProducto } = useAppState()
  const [editProducto, setEditProducto] = useState<ProductoItem | null>(null)
  const [newProducto, setNewProducto] = useState(false)
  const [form, setForm] = useState<Partial<ProductoItem>>({
    nombre: "", descripcion: "", precio_renta: 0, stock: 0, activo: true,
  })

  const openNew = () => {
    setNewProducto(true)
    setEditProducto(null)
    setForm({ nombre: "", descripcion: "", precio_renta: 0, stock: 0, activo: true })
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

      {/* Product cards for all screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((p) => (
          <Card key={p.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{p.nombre}</h3>
                    {p.activo ? (
                      <Badge className="bg-emerald-600/15 text-emerald-700 border-emerald-200 hover:bg-emerald-600/15 text-[10px]">Activo</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Inactivo</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.descripcion}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Editar producto">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Precio Renta</p>
                  <p className="text-lg font-bold">{formatMXN(p.precio_renta)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="text-lg font-bold">{p.stock} <span className="text-sm font-normal text-muted-foreground">unidades</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table for quick overview */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Descripcion</TableHead>
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
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground max-w-[200px] truncate">{p.descripcion}</TableCell>
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
                <label className="text-sm font-medium">Precio Renta (MXN)</label>
                <Input type="number" value={form.precio_renta ?? ""} onChange={(e) => setForm({ ...form, precio_renta: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" value={form.stock ?? ""} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
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
