"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import {
  ordenesData as initialOrdenes,
  clientesData as initialClientes,
  productosData as initialProductos,
  pagosData as initialPagos,
  registrosRutaData as initialRegistrosRuta,
  diasSemana,
  type Orden,
  type Cliente,
  type ProductoItem,
  type Pago,
  type RegistroRuta,
} from "./data"

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function parseFrecuenciaDays(frecuencia: string) {
  const normalized = normalizeText(frecuencia || "")
  if (normalized.includes("todos los dias")) return [...diasSemana]

  const days = diasSemana.filter((day) => normalized.includes(normalizeText(day)))
  return days.length > 0 ? days : ["Lunes"]
}

interface AppState {
  ordenes: Orden[]
  clientes: Cliente[]
  productos: ProductoItem[]
  pagos: Pago[]
  registrosRuta: RegistroRuta[]
  rutas: number[]
  isLoading: boolean
  refreshRutasFromOrdenes: () => void
  syncFromDatabase: () => Promise<void>
  updateOrden: (id: number, data: Partial<Orden>) => void
  addOrden: (data: Omit<Orden, "id" | "created_at" | "updated_at">) => void
  addCliente: (data: Omit<Cliente, "id" | "created_at">) => void
  updateCliente: (id: number, data: Partial<Cliente>) => void
  addProducto: (data: Omit<ProductoItem, "id">) => void
  updateProducto: (id: number, data: Partial<ProductoItem>) => void
  addPago: (data: Omit<Pago, "id">) => void
  deleteOrden: (id: number) => void
  deleteCliente: (id: number) => void
  deleteProducto: (id: number) => void
  deletePago: (id: number) => void
  addRuta: () => void
  deleteRuta: (num: number) => void
}

const AppContext = createContext<AppState | null>(null)
const BASE_RUTAS = [1, 2, 3, 4, 5] as const

export function AppProvider({ children }: { children: ReactNode }) {
  const [ordenes, setOrdenes] = useState<Orden[]>(initialOrdenes)
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
  const [productos, setProductos] = useState<ProductoItem[]>(initialProductos)
  const [pagos, setPagos] = useState<Pago[]>(initialPagos)
  const [registrosRuta, setRegistrosRuta] = useState<RegistroRuta[]>(initialRegistrosRuta)
  const [rutas, setRutas] = useState<number[]>([...BASE_RUTAS])
  const [isLoading, setIsLoading] = useState(true)
  const syncInFlightRef = useRef<Promise<void> | null>(null)

  const applyStateFromApi = useCallback((payload: {
    ordenes: Orden[]
    clientes: Cliente[]
    productos: ProductoItem[]
    pagos: Pago[]
    registrosRuta: RegistroRuta[]
    rutas: number[]
  }) => {
    setOrdenes(payload.ordenes)
    setClientes(payload.clientes)
    setProductos(payload.productos)
    setPagos(payload.pagos)
    setRegistrosRuta(payload.registrosRuta)
    setRutas(Array.from(new Set([...BASE_RUTAS, ...payload.rutas])).sort((a, b) => a - b))
  }, [])

  const fetchAndApplyState = useCallback(async (errorMessage: string) => {
    const res = await fetch("/api/state", { cache: "no-store" })
    if (!res.ok) throw new Error(errorMessage)
    const payload = await res.json()
    applyStateFromApi(payload)
  }, [applyStateFromApi])

  const syncFromDatabase = useCallback(async () => {
    if (syncInFlightRef.current) {
      await syncInFlightRef.current
      return
    }

    const task = (async () => {
      try {
        await fetchAndApplyState("No se pudo sincronizar desde la BD")
        console.log("Sincronización desde BD completada")
      } catch (error) {
        console.error("Error sincronizando desde PostgreSQL:", error)
      } finally {
        syncInFlightRef.current = null
      }
    })()

    syncInFlightRef.current = task
    await task
  }, [fetchAndApplyState])

  const loadFromDb = useCallback(async () => {
    try {
      await syncFromDatabase()
    } catch {
      // syncFromDatabase already logs errors; keep initial load resilient
    } finally {
      setIsLoading(false)
    }
  }, [syncFromDatabase])

  useEffect(() => {
    void loadFromDb()
  }, [loadFromDb])

  const persistMutation = useCallback(
    async (method: "POST" | "PATCH" | "DELETE", body: Record<string, unknown>) => {
      try {
        const res = await fetch("/api/state", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "Error en persistencia")
        }

        const payload = await res.json()
        applyStateFromApi(payload)
      } catch (error) {
        console.error("Error persistiendo cambios en PostgreSQL:", error)
      }
    },
    [applyStateFromApi]
  )

  const updateOrden = useCallback((id: number, data: Partial<Orden>) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...data, updated_at: new Date().toISOString().split("T")[0] } : o))
    )

    setRegistrosRuta((prev) =>
      prev.map((r) => {
        if (r.orden_id !== id) return r
        return {
          ...r,
          cliente: data.cliente_nombre ?? r.cliente,
          ubicacion: data.domicilio ?? r.ubicacion,
          notas: data.notas ?? r.notas,
          ruta: (data.ruta ?? r.ruta) as RegistroRuta["ruta"],
          map_lat: data.map_lat ?? r.map_lat ?? null,
          map_lng: data.map_lng ?? r.map_lng ?? null,
        }
      })
    )

    void persistMutation("PATCH", { entity: "ordenes", id, data })
  }, [persistMutation])

  const addOrden = useCallback(
    (data: Omit<Orden, "id" | "created_at" | "updated_at">) => {
      const newId = Math.max(...ordenes.map((o) => o.id)) + 1
      const today = new Date().toISOString().split("T")[0]
      const newOrden = { ...data, id: newId, created_at: today, updated_at: today } as Orden
      setOrdenes((prev) => [...prev, newOrden])

      const days = parseFrecuenciaDays(data.frecuencia)
      setRegistrosRuta((prev) => {
        const baseId = prev.length > 0 ? Math.max(...prev.map((r) => r.id)) + 1 : 1
        const nuevosRegistros: RegistroRuta[] = days.map((day, index) => ({
          id: baseId + index,
          orden_id: newId,
          cliente: data.cliente_nombre,
          ubicacion: data.domicilio,
          map_lat: data.map_lat ?? null,
          map_lng: data.map_lng ?? null,
          notas: data.notas || "",
          estatus: "pendiente",
          evidencia1: null,
          evidencia2: null,
          evidencia3: null,
          evidencia4: null,
          evidencia5: null,
          firma: null,
          hora_firma: null,
          ruta: data.ruta,
          dia: day,
          fecha: today,
        }))

        return [...prev, ...nuevosRegistros]
      })

      void persistMutation("POST", { entity: "ordenes", data })
    },
    [ordenes, persistMutation]
  )

  const addCliente = useCallback(
    (data: Omit<Cliente, "id" | "created_at">) => {
      const newId = Math.max(...clientes.map((c) => c.id)) + 1
      const today = new Date().toISOString().split("T")[0]
      setClientes((prev) => [...prev, { ...data, id: newId, created_at: today } as Cliente])

      void persistMutation("POST", { entity: "clientes", data })
    },
    [clientes, persistMutation]
  )

  const updateCliente = useCallback((id: number, data: Partial<Cliente>) => {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
    void persistMutation("PATCH", { entity: "clientes", id, data })
  }, [persistMutation])

  const addProducto = useCallback(
    (data: Omit<ProductoItem, "id">) => {
      const newId = Math.max(...productos.map((p) => p.id)) + 1
      setProductos((prev) => [...prev, { ...data, id: newId } as ProductoItem])

      void persistMutation("POST", { entity: "productos", data })
    },
    [productos, persistMutation]
  )

  const updateProducto = useCallback((id: number, data: Partial<ProductoItem>) => {
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
    void persistMutation("PATCH", { entity: "productos", id, data })
  }, [persistMutation])

  const addPago = useCallback(
    (data: Omit<Pago, "id">) => {
      const newId = Math.max(...pagos.map((p) => p.id)) + 1
      setPagos((prev) => [...prev, { ...data, id: newId } as Pago])

      void persistMutation("POST", { entity: "pagos", data })
    },
    [pagos, persistMutation]
  )

  const deleteOrden = useCallback((id: number) => {
    setOrdenes((prev) => prev.filter((o) => o.id !== id))
    setPagos((prev) => prev.filter((p) => p.orden_id !== id))
    setRegistrosRuta((prev) => prev.filter((r) => r.orden_id !== id))
    void persistMutation("DELETE", { entity: "ordenes", id })
  }, [persistMutation])

  const deleteCliente = useCallback((id: number) => {
    setClientes((prev) => prev.filter((c) => c.id !== id))
    void persistMutation("DELETE", { entity: "clientes", id })
  }, [persistMutation])

  const deleteProducto = useCallback((id: number) => {
    setProductos((prev) => prev.filter((p) => p.id !== id))
    void persistMutation("DELETE", { entity: "productos", id })
  }, [persistMutation])

  const deletePago = useCallback((id: number) => {
    setPagos((prev) => prev.filter((p) => p.id !== id))
    void persistMutation("DELETE", { entity: "pagos", id })
  }, [persistMutation])

  const addRuta = useCallback(() => {
    setRutas((prev) => [...prev, Math.max(...prev) + 1])
  }, [])

  const deleteRuta = useCallback((num: number) => {
    if (BASE_RUTAS.includes(num as (typeof BASE_RUTAS)[number])) return
    setRutas((prev) => prev.filter((r) => r !== num))
  }, [])

  const refreshRutasFromOrdenes = useCallback(() => {
    void syncFromDatabase()
  }, [syncFromDatabase])

  return (
    <AppContext.Provider
      value={{
        ordenes,
        clientes,
        productos,
        pagos,
        registrosRuta,
        rutas,
        isLoading,
        refreshRutasFromOrdenes,
        syncFromDatabase,
        updateOrden,
        addOrden,
        addCliente,
        updateCliente,
        addProducto,
        updateProducto,
        addPago,
        deleteOrden,
        deleteCliente,
        deleteProducto,
        deletePago,
        addRuta,
        deleteRuta,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}
