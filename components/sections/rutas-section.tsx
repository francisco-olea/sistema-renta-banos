"use client"

import { useState, useMemo } from "react"
import { useAppState } from "@/lib/app-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Image, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { diasSemana, type RegistroRuta, type EstatusRuta } from "@/lib/data"

function estatusBadge(estatus: EstatusRuta) {
  switch (estatus) {
    case "completado":
      return <Badge className="bg-status-listo/15 text-status-listo border-status-listo/25 hover:bg-status-listo/15"><CheckCircle2 className="h-3 w-3 mr-1" />Completado</Badge>
    case "en_proceso":
      return <Badge className="bg-chart-4/15 text-chart-4 border-chart-4/25 hover:bg-chart-4/15"><Loader2 className="h-3 w-3 mr-1" />En proceso</Badge>
    case "pendiente":
      return <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>
  }
}

export function RutasSection() {
  const { registrosRuta } = useAppState()
  const [selectedDay, setSelectedDay] = useState("Lunes")
  const [filterRuta, setFilterRuta] = useState<string>("todas")
  const [detailRecord, setDetailRecord] = useState<RegistroRuta | null>(null)

  const filtered = useMemo(() => {
    return registrosRuta.filter((r) => {
      if (r.dia !== selectedDay) return false
      if (filterRuta !== "todas" && r.ruta !== Number(filterRuta)) return false
      return true
    })
  }, [registrosRuta, selectedDay, filterRuta])

  const dayStats = useMemo(() => {
    const dayRecords = registrosRuta.filter((r) => r.dia === selectedDay)
    return {
      total: dayRecords.length,
      completados: dayRecords.filter((r) => r.estatus === "completado").length,
      enProceso: dayRecords.filter((r) => r.estatus === "en_proceso").length,
      pendientes: dayRecords.filter((r) => r.estatus === "pendiente").length,
    }
  }, [registrosRuta, selectedDay])

  const evidenceCount = (r: RegistroRuta) => {
    return [r.evidencia1, r.evidencia2, r.evidencia3, r.evidencia4, r.evidencia5].filter(Boolean).length
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Rutas</h2>
        <p className="text-sm text-muted-foreground mt-1">Registro de servicio de limpieza por dia</p>
      </div>

      {/* Day tabs */}
      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
        <TabsList className="w-full flex overflow-x-auto">
          {diasSemana.map((dia) => (
            <TabsTrigger key={dia} value={dia} className="flex-1 min-w-fit text-xs sm:text-sm">
              <span className="hidden sm:inline">{dia}</span>
              <span className="sm:hidden">{dia.substring(0, 3)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {diasSemana.map((dia) => (
          <TabsContent key={dia} value={dia} className="mt-4 flex flex-col gap-4">
            {/* Day stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Total</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xl font-bold">{dayStats.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-status-listo">Completados</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xl font-bold">{dayStats.completados}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-chart-4">En Proceso</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xl font-bold">{dayStats.enProceso}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Pendientes</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xl font-bold">{dayStats.pendientes}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filter by route */}
            <div className="flex items-center gap-3">
              <Select value={filterRuta} onValueChange={setFilterRuta}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar ruta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las rutas</SelectItem>
                  <SelectItem value="1">Ruta 1</SelectItem>
                  <SelectItem value="2">Ruta 2</SelectItem>
                  <SelectItem value="3">Ruta 3</SelectItem>
                  <SelectItem value="4">Ruta 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden md:table-cell">Ubicacion</TableHead>
                      <TableHead className="hidden lg:table-cell">Notas</TableHead>
                      <TableHead>Estatus</TableHead>
                      <TableHead className="hidden sm:table-cell">Evidencias</TableHead>
                      <TableHead className="hidden md:table-cell">Firma</TableHead>
                      <TableHead className="hidden lg:table-cell">Hora</TableHead>
                      <TableHead>Ruta</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          No hay registros para este dia
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{r.id}</TableCell>
                          <TableCell className="font-medium max-w-[150px] truncate">{r.cliente}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs max-w-[150px] truncate">{r.ubicacion}</TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[120px] truncate">{r.notas || "-"}</TableCell>
                          <TableCell>{estatusBadge(r.estatus)}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-1">
                              <Image className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs">{evidenceCount(r)}/5</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {r.firma ? (
                              <Badge className="bg-emerald-600/15 text-emerald-700 border-emerald-200 hover:bg-emerald-600/15 text-xs">Si</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs">{r.hora_firma || "-"}</TableCell>
                          <TableCell><Badge variant="outline">{r.ruta}</Badge></TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => setDetailRecord(r)} aria-label="Ver detalle">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Detail dialog */}
      <Dialog open={!!detailRecord} onOpenChange={(open) => !open && setDetailRecord(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle de Servicio #{detailRecord?.id}</DialogTitle>
          </DialogHeader>
          {detailRecord && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Cliente</p>
                  <p className="font-medium">{detailRecord.cliente}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Ruta</p>
                  <p className="font-medium">Ruta {detailRecord.ruta}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Ubicacion</p>
                  <p className="font-medium">{detailRecord.ubicacion}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Estatus</p>
                  <div className="mt-0.5">{estatusBadge(detailRecord.estatus)}</div>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Notas</p>
                  <p className="font-medium">{detailRecord.notas || "Sin notas"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Evidencias ({evidenceCount(detailRecord)}/5)</p>
                <div className="grid grid-cols-5 gap-2">
                  {[detailRecord.evidencia1, detailRecord.evidencia2, detailRecord.evidencia3, detailRecord.evidencia4, detailRecord.evidencia5].map((ev, i) => (
                    <div key={i} className="aspect-square rounded-lg border border-border bg-muted flex items-center justify-center">
                      {ev ? (
                        <Image className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">N/A</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm border-t border-border pt-4">
                <div>
                  <p className="text-muted-foreground text-xs">Firma</p>
                  <p className="font-medium">{detailRecord.firma ? "Firmado" : "Sin firma"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Hora de firma</p>
                  <p className="font-medium">{detailRecord.hora_firma || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Fecha</p>
                  <p className="font-medium">{detailRecord.fecha}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Dia</p>
                  <p className="font-medium">{detailRecord.dia}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
