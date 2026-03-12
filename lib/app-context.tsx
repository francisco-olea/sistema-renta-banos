"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  ordenesData as initialOrdenes,
  clientesData as initialClientes,
  productosData as initialProductos,
  pagosData as initialPagos,
  registrosRutaData as initialRegistrosRuta,
  type Orden,
  type Cliente,
  type ProductoItem,
  type Pago,
  type RegistroRuta,
} from "./data"

interface AppState {
  ordenes: Orden[]
  clientes: Cliente[]
  productos: ProductoItem[]
  pagos: Pago[]
  registrosRuta: RegistroRuta[]
  updateOrden: (id: number, data: Partial<Orden>) => void
  addOrden: (data: Omit<Orden, "id" | "created_at" | "updated_at">) => void
  addCliente: (data: Omit<Cliente, "id" | "created_at">) => void
  updateCliente: (id: number, data: Partial<Cliente>) => void
  addProducto: (data: Omit<ProductoItem, "id">) => void
  updateProducto: (id: number, data: Partial<ProductoItem>) => void
  addPago: (data: Omit<Pago, "id">) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [ordenes, setOrdenes] = useState<Orden[]>(initialOrdenes)
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
  const [productos, setProductos] = useState<ProductoItem[]>(initialProductos)
  const [pagos, setPagos] = useState<Pago[]>(initialPagos)
  const [registrosRuta] = useState<RegistroRuta[]>(initialRegistrosRuta)

  const updateOrden = useCallback((id: number, data: Partial<Orden>) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...data, updated_at: new Date().toISOString().split("T")[0] } : o))
    )
  }, [])

  const addOrden = useCallback(
    (data: Omit<Orden, "id" | "created_at" | "updated_at">) => {
      const newId = Math.max(...ordenes.map((o) => o.id)) + 1
      const today = new Date().toISOString().split("T")[0]
      setOrdenes((prev) => [...prev, { ...data, id: newId, created_at: today, updated_at: today } as Orden])
    },
    [ordenes]
  )

  const addCliente = useCallback(
    (data: Omit<Cliente, "id" | "created_at">) => {
      const newId = Math.max(...clientes.map((c) => c.id)) + 1
      const today = new Date().toISOString().split("T")[0]
      setClientes((prev) => [...prev, { ...data, id: newId, created_at: today } as Cliente])
    },
    [clientes]
  )

  const updateCliente = useCallback((id: number, data: Partial<Cliente>) => {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  }, [])

  const addProducto = useCallback(
    (data: Omit<ProductoItem, "id">) => {
      const newId = Math.max(...productos.map((p) => p.id)) + 1
      setProductos((prev) => [...prev, { ...data, id: newId } as ProductoItem])
    },
    [productos]
  )

  const updateProducto = useCallback((id: number, data: Partial<ProductoItem>) => {
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }, [])

  const addPago = useCallback(
    (data: Omit<Pago, "id">) => {
      const newId = Math.max(...pagos.map((p) => p.id)) + 1
      setPagos((prev) => [...prev, { ...data, id: newId } as Pago])
    },
    [pagos]
  )

  return (
    <AppContext.Provider
      value={{
        ordenes,
        clientes,
        productos,
        pagos,
        registrosRuta,
        updateOrden,
        addOrden,
        addCliente,
        updateCliente,
        addProducto,
        updateProducto,
        addPago,
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
