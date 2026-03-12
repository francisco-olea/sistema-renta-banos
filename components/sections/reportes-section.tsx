"use client"

import { useState, useMemo } from "react"
import { useAppState } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { FileBarChart, ShowerHead, Clock, Users } from "lucide-react"

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
}

const CHART_COLORS = ["#059669", "#0284c7", "#d97706", "#dc2626", "#7c3aed"]

export function ReportesSection() {
  const { ordenes, pagos, registrosRuta, clientes } = useAppState()
  const [activeReport, setActiveReport] = useState("renta-mensual")
  const [selectedMonth, setSelectedMonth] = useState("2026-02")

  // Reporte 1: Renta mensual
  const rentaMensual = useMemo(() => {
    const months: Record<string, number> = {}
    pagos.forEach((p) => {
      const month = p.fecha.substring(0, 7)
      months[month] = (months[month] || 0) + p.monto
    })
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({
        mes: month,
        total,
        label: new Date(month + "-01").toLocaleDateString("es-MX", { month: "short", year: "numeric" }),
      }))
  }, [pagos])

  const totalRentaMes = useMemo(() => {
    return pagos
      .filter((p) => p.fecha.startsWith(selectedMonth))
      .reduce((s, p) => s + p.monto, 0)
  }, [pagos, selectedMonth])

  // Reporte 2: Banos limpiados
  const banosLimpiados = useMemo(() => {
    const byRoute: Record<number, { completados: number; total: number }> = {}
    registrosRuta.forEach((r) => {
      if (!byRoute[r.ruta]) byRoute[r.ruta] = { completados: 0, total: 0 }
      byRoute[r.ruta].total++
      if (r.estatus === "completado") byRoute[r.ruta].completados++
    })
    return Object.entries(byRoute).map(([ruta, data]) => ({
      ruta: `Ruta ${ruta}`,
      completados: data.completados,
      pendientes: data.total - data.completados,
      total: data.total,
    }))
  }, [registrosRuta])

  const totalLimpiados = useMemo(() => {
    return registrosRuta.filter((r) => r.estatus === "completado").length
  }, [registrosRuta])

  // Reporte 3: Tiempo efectividad por ruta
  const efectividadRuta = useMemo(() => {
    const byRoute: Record<number, { firmados: number; total: number; horas: string[] }> = {}
    registrosRuta.forEach((r) => {
      if (!byRoute[r.ruta]) byRoute[r.ruta] = { firmados: 0, total: 0, horas: [] }
      byRoute[r.ruta].total++
      if (r.hora_firma) {
        byRoute[r.ruta].firmados++
        byRoute[r.ruta].horas.push(r.hora_firma)
      }
    })
    return Object.entries(byRoute).map(([ruta, data]) => {
      const pct = data.total > 0 ? Math.round((data.firmados / data.total) * 100) : 0
      return {
        ruta: `Ruta ${ruta}`,
        efectividad: pct,
        firmados: data.firmados,
        total: data.total,
      }
    })
  }, [registrosRuta])

  // Reporte 4: Servicio por cliente
  const servicioCliente = useMemo(() => {
    const byClient: Record<string, { ordenes: number; rentaTotal: number; banosActivos: number }> = {}
    ordenes.forEach((o) => {
      if (!byClient[o.cliente_nombre]) byClient[o.cliente_nombre] = { ordenes: 0, rentaTotal: 0, banosActivos: 0 }
      byClient[o.cliente_nombre].ordenes++
      byClient[o.cliente_nombre].rentaTotal += o.renta
      if (o.estado === "activo") byClient[o.cliente_nombre].banosActivos += o.cantidad
    })
    return Object.entries(byClient)
      .map(([nombre, data]) => ({ nombre, ...data }))
      .sort((a, b) => b.rentaTotal - a.rentaTotal)
  }, [ordenes])

  // Pie chart data for estados
  const estadosPie = useMemo(() => {
    const activos = ordenes.filter((o) => o.estado === "activo").length
    const terminados = ordenes.filter((o) => o.estado === "terminado").length
    const cancelados = ordenes.filter((o) => o.estado === "cancelado").length
    return [
      { name: "Activos", value: activos },
      { name: "Terminados", value: terminados },
      { name: "Cancelados", value: cancelados },
    ]
  }, [ordenes])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Reportes</h2>
        <p className="text-sm text-muted-foreground mt-1">Analisis y reportes del negocio</p>
      </div>

      <Tabs value={activeReport} onValueChange={setActiveReport}>
        <TabsList className="w-full flex overflow-x-auto">
          <TabsTrigger value="renta-mensual" className="flex-1 min-w-fit text-xs sm:text-sm">
            <FileBarChart className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Renta Mensual
          </TabsTrigger>
          <TabsTrigger value="banos-limpiados" className="flex-1 min-w-fit text-xs sm:text-sm">
            <ShowerHead className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Limpieza
          </TabsTrigger>
          <TabsTrigger value="efectividad" className="flex-1 min-w-fit text-xs sm:text-sm">
            <Clock className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Efectividad
          </TabsTrigger>
          <TabsTrigger value="por-cliente" className="flex-1 min-w-fit text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
            Por Cliente
          </TabsTrigger>
        </TabsList>

        {/* Renta Mensual */}
        <TabsContent value="renta-mensual" className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-02">Febrero 2026</SelectItem>
                <SelectItem value="2026-01">Enero 2026</SelectItem>
                <SelectItem value="2025-12">Diciembre 2025</SelectItem>
              </SelectContent>
            </Select>
            <Card className="flex-1">
              <CardContent className="py-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total del mes</span>
                <span className="text-xl font-bold">{formatMXN(totalRentaMes)}</span>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ingresos por Mes</CardTitle>
              <CardDescription>Total cobrado por mes en MXN</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rentaMensual}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" className="text-xs" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: number) => [formatMXN(value), "Total"]}
                      contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px" }}
                    />
                    <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pagos del Mes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Metodo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagos
                      .filter((p) => p.fecha.startsWith(selectedMonth))
                      .map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-sm max-w-[140px] truncate">{p.cliente_nombre}</TableCell>
                          <TableCell className="font-semibold">{formatMXN(p.monto)}</TableCell>
                          <TableCell className="text-xs">{p.metodo}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ordenes por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={estadosPie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {estadosPie.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Banos limpiados */}
        <TabsContent value="banos-limpiados" className="mt-4 flex flex-col gap-4">
          <Card>
            <CardContent className="py-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total servicios completados</span>
              <span className="text-xl font-bold">{totalLimpiados}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Servicios por Ruta</CardTitle>
              <CardDescription>Completados vs pendientes por ruta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={banosLimpiados}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="ruta" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px" }} />
                    <Bar dataKey="completados" fill="#059669" name="Completados" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pendientes" fill="#d97706" name="Pendientes" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Completados</TableHead>
                    <TableHead>Pendientes</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Tasa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banosLimpiados.map((r) => (
                    <TableRow key={r.ruta}>
                      <TableCell className="font-medium">{r.ruta}</TableCell>
                      <TableCell className="text-emerald-700 font-semibold">{r.completados}</TableCell>
                      <TableCell className="text-amber-700">{r.pendientes}</TableCell>
                      <TableCell>{r.total}</TableCell>
                      <TableCell>
                        <Badge className={
                          r.total > 0 && (r.completados / r.total) >= 0.7
                            ? "bg-emerald-600/15 text-emerald-700 border-emerald-200 hover:bg-emerald-600/15"
                            : "bg-amber-600/15 text-amber-700 border-amber-200 hover:bg-amber-600/15"
                        }>
                          {r.total > 0 ? Math.round((r.completados / r.total) * 100) : 0}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Efectividad */}
        <TabsContent value="efectividad" className="mt-4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Efectividad por Ruta</CardTitle>
              <CardDescription>Porcentaje de servicios firmados y completados a tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efectividadRuta}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="ruta" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Efectividad"]}
                      contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px" }}
                    />
                    <Bar dataKey="efectividad" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Firmados</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Efectividad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {efectividadRuta.map((r) => (
                    <TableRow key={r.ruta}>
                      <TableCell className="font-medium">{r.ruta}</TableCell>
                      <TableCell>{r.firmados}</TableCell>
                      <TableCell>{r.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-sky-600 transition-all"
                              style={{ width: `${r.efectividad}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{r.efectividad}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Por Cliente */}
        <TabsContent value="por-cliente" className="mt-4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Servicio por Cliente</CardTitle>
              <CardDescription>Resumen de ordenes, renta total y unidades activas por cliente</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Ordenes</TableHead>
                    <TableHead>Renta Total</TableHead>
                    <TableHead className="hidden sm:table-cell">Unidades Activas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicioCliente.map((c) => (
                    <TableRow key={c.nombre}>
                      <TableCell className="font-medium max-w-[200px] truncate">{c.nombre}</TableCell>
                      <TableCell>{c.ordenes}</TableCell>
                      <TableCell className="font-semibold">{formatMXN(c.rentaTotal)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{c.banosActivos}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Renta por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={servicioCliente.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="nombre" type="category" width={120} tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                    <Tooltip
                      formatter={(value: number) => [formatMXN(value), "Renta"]}
                      contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px" }}
                    />
                    <Bar dataKey="rentaTotal" fill="#059669" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
