"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { useAppState } from "@/lib/app-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Image, CheckCircle2, Clock, Loader2, Plus, Trash2, ArrowDown, RefreshCcw } from "lucide-react"
import { diasSemana, type RegistroRuta, type EstatusRuta } from "@/lib/data"

const RutaMap = dynamic(() => import("@/components/ruta-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
      Cargando mapa...
    </div>
  ),
})

function estatusBadge(estatus: EstatusRuta | string) {
  const statusStr = String(estatus).toLowerCase()
  switch (statusStr) {
    case "completado":
    case "listo":
      return <Badge className="bg-status-listo/15 text-status-listo border-status-listo/25 hover:bg-status-listo/15"><CheckCircle2 className="h-3 w-3 mr-1" />Listo</Badge>
    case "en_proceso":
      return <Badge className="bg-chart-4/15 text-chart-4 border-chart-4/25 hover:bg-chart-4/15"><Loader2 className="h-3 w-3 mr-1" />En proceso</Badge>
    case "cerrado":
      return <Badge className="bg-status-cerrado/15 text-status-cerrado border-status-cerrado/25 hover:bg-status-cerrado/15"><CheckCircle2 className="h-3 w-3 mr-1" />Cerrado</Badge>
    case "material estorbando":
    case "material_estorbando":
      return <Badge className="bg-status-cerrado/15 text-status-cerrado border-status-cerrado/25 hover:bg-status-cerrado/15"><CheckCircle2 className="h-3 w-3 mr-1" />Material Estorbando</Badge>
    case "notas":
      return <Badge className="bg-violet-500/15 text-violet-700 border-violet-400/30 hover:bg-violet-500/15"><Clock className="h-3 w-3 mr-1" />Notas</Badge>
    case "pendiente":
    default:
      return <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted"><Clock className="h-3 w-3 mr-1" />{statusStr === "pendiente" ? "Pendiente" : estatus}</Badge>
  }
}

export function RutasSection() {
  const { registrosRuta, rutas, addRuta, deleteRuta, refreshRutasFromOrdenes, syncFromDatabase } = useAppState()
  const [orderedRegistros, setOrderedRegistros] = useState<RegistroRuta[]>(registrosRuta)
  const [selectedDay, setSelectedDay] = useState("Lunes")
  const [filterRuta, setFilterRuta] = useState<string>("1")
  const [detailRecord, setDetailRecord] = useState<RegistroRuta | null>(null)
  const [confirmAdd, setConfirmAdd] = useState(false)
  const [rutaToDelete, setRutaToDelete] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [justUpdated, setJustUpdated] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const isBaseRoute = Number(filterRuta) <= 5

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

  const handleSync = async () => {
    if (isSyncing) return

    setIsSyncing(true)
    await syncFromDatabase()
    setIsSyncing(false)
  }

  useEffect(() => {
    if (rutas.length === 0) return
    if (!rutas.includes(Number(filterRuta))) {
      setFilterRuta(rutas.includes(1) ? "1" : String(rutas[0]))
    }
  }, [rutas, filterRuta])

  useEffect(() => {
    setOrderedRegistros((prev) => {
      const fromContextById = new Map(registrosRuta.map((r) => [r.id, r]))

      // Preserve local visual order, but refresh each row with latest context data.
      const merged = prev
        .filter((r) => fromContextById.has(r.id))
        .map((r) => fromContextById.get(r.id) as RegistroRuta)

      const knownIds = new Set(merged.map((r) => r.id))
      const nuevos = registrosRuta.filter((r) => !knownIds.has(r.id))
      return [...merged, ...nuevos]
    })
  }, [registrosRuta])

  const filtered = useMemo(() => {
    return orderedRegistros.filter((r) => {
      if (r.dia !== selectedDay) return false
      if (r.ruta !== Number(filterRuta)) return false
      return true
    })
  }, [orderedRegistros, selectedDay, filterRuta])

  const dayStats = useMemo(() => {
    const dayRecords = orderedRegistros.filter((r) => r.dia === selectedDay)
    return {
      total: dayRecords.length,
      completados: dayRecords.filter((r) => r.estatus === "completado").length,
      enProceso: dayRecords.filter((r) => r.estatus === "en_proceso").length,
      pendientes: dayRecords.filter((r) => r.estatus === "pendiente").length,
    }
  }, [orderedRegistros, selectedDay])

  const moveRecordDown = (recordId: number) => {
    setOrderedRegistros((prev) => {
      const currentIndex = prev.findIndex((r) => r.id === recordId)
      if (currentIndex === -1) return prev

      const nextIndex = prev.findIndex((r, idx) => {
        if (idx <= currentIndex) return false
        if (r.dia !== selectedDay) return false
        if (r.ruta !== Number(filterRuta)) return false
        return true
      })

      if (nextIndex === -1) return prev

      const next = [...prev]
      const temp = next[currentIndex]
      next[currentIndex] = next[nextIndex]
      next[nextIndex] = temp
      return next
    })
  }

  const evidenceCount = (r: RegistroRuta) => {
    return [r.evidencia1, r.evidencia2, r.evidencia3, r.evidencia4, r.evidencia5].filter(Boolean).length
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Rutas</h2>
        <p className="text-sm text-muted-foreground mt-1">Registro de servicio de limpieza por dia</p>
      </div>

      {/* Route filter buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={handleSync}
          disabled={isSyncing}
          className="rounded-full"
          title="Sincronizar datos desde la base de datos"
        >
          <RefreshCcw className={`h-4 w-4 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Sincronizando..." : "Sincronizar"}
        </Button>
        {rutas.map((r) => (
          <Button
            key={r}
            variant={filterRuta === String(r) ? "default" : "outline"}
            onClick={() => setFilterRuta(String(r))}
            className="rounded-full"
          >
            Ruta {r}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => setConfirmAdd(true)}
          className="rounded-full border-dashed"
          disabled
          title="La app tiene 5 rutas habilitadas por defecto. Este botón se habilita cuando se requieran más rutas."
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar Ruta
        </Button>
      </div>

      {/* Map */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-semibold">
            Ubicaciones de clientes
            <span className="ml-2 text-muted-foreground font-normal">— Ruta {filterRuta}</span>
            <span className="ml-2 text-muted-foreground font-normal text-xs">
              ({filtered.length} {filtered.length === 1 ? "cliente" : "clientes"} — {selectedDay})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RutaMap records={filtered} />
        </CardContent>
      </Card>

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

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
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
                      filtered.map((r, idx) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-muted-foreground">{idx + 1}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveRecordDown(r.id)}
                                aria-label={`Mover ${r.cliente} hacia abajo`}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
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

            <div className="flex justify-end">
              <button
                onClick={() => setRutaToDelete(Number(filterRuta))}
                disabled={isBaseRoute}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {isBaseRoute ? `Ruta ${filterRuta} fija` : `Eliminar Ruta ${filterRuta}`}
              </button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Detail dialog */}
      <Dialog open={!!detailRecord} onOpenChange={(open) => !open && setDetailRecord(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle de Servicio #{detailRecord?.id}</DialogTitle>
            <DialogDescription>
              Consulta la informacion del servicio, evidencias y datos de firma.
            </DialogDescription>
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
                  {[detailRecord.evidencia1, detailRecord.evidencia2, detailRecord.evidencia3, detailRecord.evidencia4, detailRecord.evidencia5].map((ev, i) => {
                    const isBase64 = ev && typeof ev === 'string' && ev.startsWith('data:image')
                    return (
                      <div key={i} className="aspect-square rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden">
                        {isBase64 ? (
                          <img src={ev as string} alt={`Evidencia ${i + 1}`} className="w-full h-full object-cover" />
                        ) : ev ? (
                          <Image className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <span className="text-[10px] text-muted-foreground text-center px-1">No</span>
                        )}
                      </div>
                    )
                  })}
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

      {/* Confirm add route */}
      <AlertDialog open={confirmAdd} onOpenChange={setConfirmAdd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Agregar nueva ruta?</AlertDialogTitle>
            <AlertDialogDescription>
              La app mantiene <strong>5 rutas habilitadas por defecto</strong>. Cuando el cliente requiera más rutas, este botón podrá habilitarse para crear la siguiente ruta disponible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { addRuta(); setConfirmAdd(false) }}>
              Agregar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm delete route */}
      <AlertDialog open={rutaToDelete !== null} onOpenChange={(open) => !open && setRutaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">¿Eliminar Ruta {rutaToDelete}?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Esta acción eliminará la Ruta {rutaToDelete} de la lista.
            </AlertDialogDescription>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Los registros existentes con esta ruta no serán afectados y esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (rutaToDelete !== null) {
                  if (rutaToDelete <= 5) {
                    setRutaToDelete(null)
                    return
                  }

                  const nextRoutes = rutas.filter((r) => r !== rutaToDelete)
                  deleteRuta(rutaToDelete)
                  if (filterRuta === String(rutaToDelete)) {
                    setFilterRuta(nextRoutes.includes(1) ? "1" : String(nextRoutes[0] ?? 1))
                  }
                  setRutaToDelete(null)
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
