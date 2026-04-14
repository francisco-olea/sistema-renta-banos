"use client"

import { useState, useMemo } from "react"
import { useAppState } from "@/lib/app-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Search, Phone, Mail, Building2 } from "lucide-react"
import type { Cliente } from "@/lib/data"

export function ClientesSection() {
  const { clientes, addCliente, updateCliente } = useAppState()
  const [search, setSearch] = useState("")
  const [editCliente, setEditCliente] = useState<Cliente | null>(null)
  const [newCliente, setNewCliente] = useState(false)
  const [form, setForm] = useState<Partial<Cliente>>({
    nombre: "", telefono: "", email: "", empresa: "", rfc: "", domicilio: "",
  })

  const filtered = useMemo(() => {
    if (!search) return clientes
    const s = search.toLowerCase()
    return clientes.filter(
      (c) => c.nombre.toLowerCase().includes(s) || c.empresa.toLowerCase().includes(s) || c.telefono.includes(s)
    )
  }, [clientes, search])

  const openNew = () => {
    setNewCliente(true)
    setEditCliente(null)
    setForm({ nombre: "", telefono: "", email: "", empresa: "", rfc: "", domicilio: "" })
  }

  const openEdit = (c: Cliente) => {
    setEditCliente(c)
    setNewCliente(false)
    setForm({ ...c })
  }

  const save = () => {
    if (newCliente) {
      addCliente(form as Omit<Cliente, "id" | "created_at">)
      setNewCliente(false)
    } else if (editCliente) {
      updateCliente(editCliente.id, form)
      setEditCliente(null)
    }
  }

  const closeDialog = () => { setEditCliente(null); setNewCliente(false) }
  const isOpen = !!editCliente || newCliente

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Clientes</h2>
          <p className="text-sm text-muted-foreground mt-1">Directorio de clientes</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre, empresa o telefono..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="hidden lg:table-cell">Telefono</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead className="hidden xl:table-cell">RFC</TableHead>
                <TableHead className="hidden xl:table-cell">Domicilio</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No se encontraron clientes</TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell className="font-medium">{c.nombre}</TableCell>
                    <TableCell className="text-sm">{c.empresa}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{c.telefono}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="hidden xl:table-cell text-xs font-mono">{c.rfc}</TableCell>
                    <TableCell className="hidden xl:table-cell text-xs max-w-[180px] truncate">{c.domicilio}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)} aria-label="Editar cliente">
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

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">No se encontraron clientes</CardContent>
          </Card>
        ) : (
          filtered.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-semibold text-sm">{c.nombre}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {c.empresa}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {c.telefono}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {c.email}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{newCliente ? "Nuevo Cliente" : `Editar Cliente #${editCliente?.id}`}</DialogTitle>
            <DialogDescription>
              Completa los datos de contacto y domicilio del cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Nombre</label>
              <Input value={form.nombre ?? ""} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Empresa</label>
                <Input value={form.empresa ?? ""} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">RFC</label>
                <Input value={form.rfc ?? ""} onChange={(e) => setForm({ ...form, rfc: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Telefono</label>
                <Input value={form.telefono ?? ""} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Domicilio</label>
              <Input value={form.domicilio ?? ""} onChange={(e) => setForm({ ...form, domicilio: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button onClick={save}>{newCliente ? "Crear" : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
