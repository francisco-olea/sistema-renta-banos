// Types and demo data simulating PostgreSQL tables

export type EstadoOrden = "activo" | "terminado" | "cancelado"
export type TipoOrden = "Obra" | "Evento" | "Otro"
export type Producto = "Bano" | "Lavamanos"
export type RutaNum = 1 | 2 | 3 | 4
export type Frecuencia =
  | "Todos los dias"
  | "Lunes y Miercoles"
  | "Martes y Jueves"
  | "Lunes, Miercoles y Viernes"
  | "Solo Sabados"
  | "Semanal"
export type EstatusRuta = "pendiente" | "en_proceso" | "completado"

export interface Orden {
  id: number
  cliente_id: number
  cliente_nombre: string
  tipo: TipoOrden
  estado: EstadoOrden
  renta: number
  producto: string
  cantidad: number
  ruta: RutaNum
  frecuencia: Frecuencia
  domicilio: string
  fecha_inicio: string
  fecha_fin: string | null
  notas: string
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: number
  nombre: string
  telefono: string
  email: string
  empresa: string
  rfc: string
  domicilio: string
  created_at: string
}

export interface ProductoItem {
  id: number
  nombre: string
  descripcion: string
  precio_renta: number
  stock: number
  activo: boolean
}

export interface RegistroRuta {
  id: number
  orden_id: number
  cliente: string
  ubicacion: string
  notas: string
  estatus: EstatusRuta
  evidencia1: string | null
  evidencia2: string | null
  evidencia3: string | null
  evidencia4: string | null
  evidencia5: string | null
  firma: string | null
  hora_firma: string | null
  ruta: RutaNum
  dia: string
  fecha: string
}

export interface Pago {
  id: number
  orden_id: number
  cliente_nombre: string
  monto: number
  metodo: "Efectivo" | "Transferencia" | "Tarjeta"
  fecha: string
  concepto: string
  estatus: "pagado" | "pendiente" | "vencido"
}

// Demo data
export const clientesData: Cliente[] = [
  { id: 1, nombre: "Constructora Noroeste del Desierto", telefono: "653-112-3401", email: "contacto@cnod.mx", empresa: "Constructora Noroeste del Desierto", rfc: "CND260101A11", domicilio: "Av. Obregon 1201, Municipio de San Luis RC, Sonora", created_at: "2025-01-15" },
  { id: 2, nombre: "Eventos Rio Colorado", telefono: "653-112-3402", email: "info@eventosriocolorado.mx", empresa: "Eventos Rio Colorado SA de CV", rfc: "ERC260101B22", domicilio: "Blvd. Luis Donaldo Colosio 455, San Luis RC, Sonora", created_at: "2025-02-10" },
  { id: 3, nombre: "Inmobiliaria Pinacate", telefono: "653-112-3403", email: "admin@pinacateinmobiliaria.mx", empresa: "Inmobiliaria Pinacate", rfc: "IPI260101C33", domicilio: "Calle Segunda 908, Col. Comercial, San Luis RC, Sonora", created_at: "2025-03-05" },
  { id: 4, nombre: "Festival del Golfo de Santa Clara", telefono: "653-112-3404", email: "logistica@festivalgsc.mx", empresa: "Festival del Golfo de Santa Clara AC", rfc: "FGS260101D44", domicilio: "Malecon Turistico S/N, Golfo de Santa Clara, Sonora", created_at: "2025-04-20" },
  { id: 5, nombre: "Grupo Constructor San Luis RC", telefono: "653-112-3405", email: "obras@gcslrc.mx", empresa: "Grupo Constructor San Luis RC", rfc: "GCS260101E55", domicilio: "Carretera San Luis RC - Mexicali Km 7, Sonora", created_at: "2025-05-12" },
  { id: 6, nombre: "Bodas del Noroeste", telefono: "653-112-3406", email: "reservas@bodasnoroeste.mx", empresa: "Bodas del Noroeste SA de CV", rfc: "BNO260101F66", domicilio: "Av. Kino 320, Municipio de San Luis RC, Sonora", created_at: "2025-06-01" },
  { id: 7, nombre: "Desarrollo Urbano Sonora Desierto", telefono: "653-112-3407", email: "proyectos@dusd.mx", empresa: "Desarrollo Urbano Sonora Desierto", rfc: "DUS260101G77", domicilio: "Eje Federalismo 2100, San Luis RC, Sonora", created_at: "2025-07-15" },
  { id: 8, nombre: "Municipio de San Luis RC", telefono: "653-112-3408", email: "obras.publicas@sanluisrc.gob.mx", empresa: "Municipio de San Luis RC", rfc: "MSL260101H88", domicilio: "Palacio Municipal S/N, San Luis Rio Colorado, Sonora", created_at: "2025-08-01" },
]

export const productosData: ProductoItem[] = [
  { id: 1, nombre: "Baño Portátil Estándar", descripcion: "Baño portátil tipo estándar con tanque de 250L", precio_renta: 1500, stock: 50, activo: true },
  { id: 2, nombre: "Lavamanos Portátil", descripcion: "Estación de lavamanos portátil con depósito de agua", precio_renta: 800, stock: 20, activo: true },
]

export const ordenesData: Orden[] = [
  { id: 1001, cliente_id: 1, cliente_nombre: "Constructora Noroeste del Desierto", tipo: "Obra", estado: "activo", renta: 4500, producto: "Baño Portátil Estándar", cantidad: 3, ruta: 1, frecuencia: "Lunes, Miercoles y Viernes", domicilio: "Obra Av. Obregon 1201, San Luis RC", fecha_inicio: "2026-01-10", fecha_fin: null, notas: "Acceso por puerta trasera", created_at: "2026-01-10", updated_at: "2026-02-20" },
  { id: 1002, cliente_id: 2, cliente_nombre: "Eventos Rio Colorado", tipo: "Evento", estado: "activo", renta: 3200, producto: "Baño Portátil Estándar", cantidad: 4, ruta: 2, frecuencia: "Todos los dias", domicilio: "Blvd. Luis Donaldo Colosio 455, San Luis RC", fecha_inicio: "2026-02-01", fecha_fin: "2026-02-28", notas: "Evento corporativo", created_at: "2026-02-01", updated_at: "2026-02-18" },
  { id: 1003, cliente_id: 3, cliente_nombre: "Inmobiliaria Pinacate", tipo: "Obra", estado: "activo", renta: 6000, producto: "Baño Portátil Estándar", cantidad: 4, ruta: 1, frecuencia: "Lunes y Miercoles", domicilio: "Calle Segunda 908, Col. Comercial, San Luis RC", fecha_inicio: "2026-01-20", fecha_fin: null, notas: "", created_at: "2026-01-20", updated_at: "2026-02-19" },
  { id: 1004, cliente_id: 2, cliente_nombre: "Eventos Rio Colorado", tipo: "Evento", estado: "terminado", renta: 2400, producto: "Lavamanos Portatil", cantidad: 3, ruta: 2, frecuencia: "Todos los dias", domicilio: "Centro de Convenciones Rio Colorado, San Luis RC", fecha_inicio: "2026-01-15", fecha_fin: "2026-02-10", notas: "Lavamanos para evento de gala", created_at: "2026-01-15", updated_at: "2026-02-10" },
  { id: 1005, cliente_id: 4, cliente_nombre: "Festival del Golfo de Santa Clara", tipo: "Evento", estado: "activo", renta: 12000, producto: "Baño Portátil Estándar", cantidad: 8, ruta: 3, frecuencia: "Todos los dias", domicilio: "Malecon Turistico S/N, Golfo de Santa Clara", fecha_inicio: "2026-02-10", fecha_fin: "2026-03-10", notas: "Festival de musica, alta demanda", created_at: "2026-02-10", updated_at: "2026-02-21" },
  { id: 1006, cliente_id: 5, cliente_nombre: "Grupo Constructor San Luis RC", tipo: "Obra", estado: "activo", renta: 3000, producto: "Baño Portátil Estándar", cantidad: 2, ruta: 3, frecuencia: "Martes y Jueves", domicilio: "Carretera San Luis RC - Mexicali Km 7", fecha_inicio: "2026-02-05", fecha_fin: null, notas: "", created_at: "2026-02-05", updated_at: "2026-02-17" },
  { id: 1007, cliente_id: 6, cliente_nombre: "Bodas del Noroeste", tipo: "Evento", estado: "cancelado", renta: 4800, producto: "Baño Portátil Estándar", cantidad: 6, ruta: 4, frecuencia: "Solo Sabados", domicilio: "Salon Oasis del Desierto, San Luis RC", fecha_inicio: "2026-02-15", fecha_fin: "2026-02-15", notas: "Cancelado por el cliente", created_at: "2026-02-12", updated_at: "2026-02-14" },
  { id: 1008, cliente_id: 7, cliente_nombre: "Desarrollo Urbano Sonora Desierto", tipo: "Obra", estado: "activo", renta: 7500, producto: "Baño Portátil Estándar", cantidad: 5, ruta: 4, frecuencia: "Lunes, Miercoles y Viernes", domicilio: "Eje Federalismo 2100, San Luis RC", fecha_inicio: "2026-01-05", fecha_fin: null, notas: "Obra de larga duracion", created_at: "2026-01-05", updated_at: "2026-02-22" },
  { id: 1009, cliente_id: 5, cliente_nombre: "Grupo Constructor San Luis RC", tipo: "Obra", estado: "activo", renta: 1600, producto: "Lavamanos Portatil", cantidad: 2, ruta: 3, frecuencia: "Martes y Jueves", domicilio: "Carretera San Luis RC - Mexicali Km 7", fecha_inicio: "2026-02-05", fecha_fin: null, notas: "Complemento de banos", created_at: "2026-02-05", updated_at: "2026-02-17" },
  { id: 1010, cliente_id: 8, cliente_nombre: "Municipio de San Luis RC", tipo: "Otro", estado: "activo", renta: 9000, producto: "Baño Portátil Estándar", cantidad: 6, ruta: 2, frecuencia: "Lunes y Miercoles", domicilio: "Palacio Municipal S/N, San Luis Rio Colorado", fecha_inicio: "2026-02-01", fecha_fin: null, notas: "Servicio municipal, facturar a gobierno", created_at: "2026-02-01", updated_at: "2026-02-20" },
  { id: 1011, cliente_id: 1, cliente_nombre: "Constructora Noroeste del Desierto", tipo: "Obra", estado: "terminado", renta: 3000, producto: "Baño Portátil Estándar", cantidad: 2, ruta: 1, frecuencia: "Semanal", domicilio: "Col. Comercial, San Luis RC", fecha_inicio: "2025-11-01", fecha_fin: "2026-01-31", notas: "Obra terminada", created_at: "2025-11-01", updated_at: "2026-01-31" },
  { id: 1012, cliente_id: 4, cliente_nombre: "Festival del Golfo de Santa Clara", tipo: "Evento", estado: "terminado", renta: 5600, producto: "Lavamanos Portatil", cantidad: 7, ruta: 3, frecuencia: "Todos los dias", domicilio: "Malecon Turistico S/N, Golfo de Santa Clara", fecha_inicio: "2025-12-15", fecha_fin: "2026-01-05", notas: "Festival decembrino finalizado", created_at: "2025-12-15", updated_at: "2026-01-05" },
]

export const pagosData: Pago[] = [
  { id: 1, orden_id: 1001, cliente_nombre: "Constructora Noroeste del Desierto", monto: 4500, metodo: "Transferencia", fecha: "2026-02-01", concepto: "Renta mensual febrero", estatus: "pagado" },
  { id: 2, orden_id: 1002, cliente_nombre: "Eventos Rio Colorado", monto: 3200, metodo: "Tarjeta", fecha: "2026-02-01", concepto: "Renta evento febrero", estatus: "pagado" },
  { id: 3, orden_id: 1003, cliente_nombre: "Inmobiliaria Pinacate", monto: 6000, metodo: "Transferencia", fecha: "2026-02-05", concepto: "Renta mensual febrero", estatus: "pagado" },
  { id: 4, orden_id: 1005, cliente_nombre: "Festival del Golfo de Santa Clara", monto: 12000, metodo: "Transferencia", fecha: "2026-02-10", concepto: "Renta festival completo", estatus: "pagado" },
  { id: 5, orden_id: 1006, cliente_nombre: "Grupo Constructor San Luis RC", monto: 3000, metodo: "Efectivo", fecha: "2026-02-15", concepto: "Renta mensual febrero", estatus: "pagado" },
  { id: 6, orden_id: 1008, cliente_nombre: "Desarrollo Urbano Sonora Desierto", monto: 7500, metodo: "Transferencia", fecha: "2026-02-01", concepto: "Renta mensual febrero", estatus: "pagado" },
  { id: 7, orden_id: 1009, cliente_nombre: "Grupo Constructor San Luis RC", monto: 1600, metodo: "Efectivo", fecha: "2026-02-15", concepto: "Lavamanos febrero", estatus: "pagado" },
  { id: 8, orden_id: 1010, cliente_nombre: "Municipio de San Luis RC", monto: 9000, metodo: "Transferencia", fecha: "2026-02-10", concepto: "Servicio municipal febrero", estatus: "pendiente" },
  { id: 9, orden_id: 1001, cliente_nombre: "Constructora Noroeste del Desierto", monto: 4500, metodo: "Transferencia", fecha: "2026-01-05", concepto: "Renta mensual enero", estatus: "pagado" },
  { id: 10, orden_id: 1011, cliente_nombre: "Constructora Noroeste del Desierto", monto: 3000, metodo: "Efectivo", fecha: "2026-01-10", concepto: "Renta enero Col. Comercial", estatus: "pagado" },
  { id: 11, orden_id: 1004, cliente_nombre: "Eventos Rio Colorado", monto: 2400, metodo: "Tarjeta", fecha: "2026-01-20", concepto: "Lavamanos evento gala", estatus: "pagado" },
  { id: 12, orden_id: 1008, cliente_nombre: "Desarrollo Urbano Sonora Desierto", monto: 7500, metodo: "Transferencia", fecha: "2026-01-05", concepto: "Renta mensual enero", estatus: "pagado" },
]

const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]

export const registrosRutaData: RegistroRuta[] = [
  // Lunes
  { id: 1, orden_id: 1001, cliente: "Constructora Noroeste del Desierto", ubicacion: "Obra Av. Obregon 1201", notas: "Sin novedad", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: "/placeholder.svg", evidencia3: null, evidencia4: null, evidencia5: null, firma: "/placeholder.svg", hora_firma: "09:15", ruta: 1, dia: "Lunes", fecha: "2026-02-16" },
  { id: 2, orden_id: 1003, cliente: "Inmobiliaria Pinacate", ubicacion: "Calle Segunda 908", notas: "Acceso complicado", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: "/placeholder.svg", hora_firma: "10:30", ruta: 1, dia: "Lunes", fecha: "2026-02-16" },
  { id: 3, orden_id: 1010, cliente: "Municipio de San Luis RC", ubicacion: "Palacio Municipal S/N", notas: "", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: "/placeholder.svg", evidencia3: "/placeholder.svg", evidencia4: null, evidencia5: null, firma: "/placeholder.svg", hora_firma: "11:45", ruta: 2, dia: "Lunes", fecha: "2026-02-16" },
  { id: 4, orden_id: 1005, cliente: "Festival del Golfo de Santa Clara", ubicacion: "Malecon Turistico S/N", notas: "Mucha gente, dificil acceso", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: "/placeholder.svg", evidencia3: "/placeholder.svg", evidencia4: "/placeholder.svg", evidencia5: null, firma: "/placeholder.svg", hora_firma: "13:00", ruta: 3, dia: "Lunes", fecha: "2026-02-16" },
  { id: 5, orden_id: 1008, cliente: "Desarrollo Urbano Sonora Desierto", ubicacion: "Eje Federalismo 2100", notas: "", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: "/placeholder.svg", hora_firma: "14:30", ruta: 4, dia: "Lunes", fecha: "2026-02-16" },
  // Martes
  { id: 6, orden_id: 1002, cliente: "Eventos Rio Colorado", ubicacion: "Blvd. Luis Donaldo Colosio 455", notas: "", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: "/placeholder.svg", evidencia3: null, evidencia4: null, evidencia5: null, firma: "/placeholder.svg", hora_firma: "08:45", ruta: 2, dia: "Martes", fecha: "2026-02-17" },
  { id: 7, orden_id: 1006, cliente: "Grupo Constructor San Luis RC", ubicacion: "Carretera San Luis RC - Mexicali Km 7", notas: "Limpieza profunda", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: "/placeholder.svg", evidencia3: null, evidencia4: null, evidencia5: null, firma: "/placeholder.svg", hora_firma: "10:00", ruta: 3, dia: "Martes", fecha: "2026-02-17" },
  { id: 8, orden_id: 1009, cliente: "Grupo Constructor San Luis RC", ubicacion: "Carretera San Luis RC - Mexicali Km 7", notas: "Lavamanos OK", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: "/placeholder.svg", hora_firma: "10:15", ruta: 3, dia: "Martes", fecha: "2026-02-17" },
  { id: 9, orden_id: 1005, cliente: "Festival del Golfo de Santa Clara", ubicacion: "Malecon Turistico S/N", notas: "", estatus: "completado", evidencia1: "/placeholder.svg", evidencia2: "/placeholder.svg", evidencia3: null, evidencia4: null, evidencia5: null, firma: "/placeholder.svg", hora_firma: "12:00", ruta: 3, dia: "Martes", fecha: "2026-02-17" },
  // Miercoles
  { id: 10, orden_id: 1001, cliente: "Constructora Noroeste del Desierto", ubicacion: "Obra Av. Obregon 1201", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 1, dia: "Miercoles", fecha: "2026-02-18" },
  { id: 11, orden_id: 1003, cliente: "Inmobiliaria Pinacate", ubicacion: "Calle Segunda 908", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 1, dia: "Miercoles", fecha: "2026-02-18" },
  { id: 12, orden_id: 1010, cliente: "Municipio de San Luis RC", ubicacion: "Palacio Municipal S/N", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 2, dia: "Miercoles", fecha: "2026-02-18" },
  { id: 13, orden_id: 1005, cliente: "Festival del Golfo de Santa Clara", ubicacion: "Malecon Turistico S/N", notas: "", estatus: "en_proceso", evidencia1: "/placeholder.svg", evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 3, dia: "Miercoles", fecha: "2026-02-18" },
  { id: 14, orden_id: 1008, cliente: "Desarrollo Urbano Sonora Desierto", ubicacion: "Eje Federalismo 2100", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 4, dia: "Miercoles", fecha: "2026-02-18" },
  // Jueves
  { id: 15, orden_id: 1002, cliente: "Eventos Rio Colorado", ubicacion: "Blvd. Luis Donaldo Colosio 455", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 2, dia: "Jueves", fecha: "2026-02-19" },
  { id: 16, orden_id: 1006, cliente: "Grupo Constructor San Luis RC", ubicacion: "Carretera San Luis RC - Mexicali Km 7", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 3, dia: "Jueves", fecha: "2026-02-19" },
  { id: 17, orden_id: 1005, cliente: "Festival del Golfo de Santa Clara", ubicacion: "Malecon Turistico S/N", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 3, dia: "Jueves", fecha: "2026-02-19" },
  // Viernes
  { id: 18, orden_id: 1001, cliente: "Constructora Noroeste del Desierto", ubicacion: "Obra Av. Obregon 1201", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 1, dia: "Viernes", fecha: "2026-02-20" },
  { id: 19, orden_id: 1005, cliente: "Festival del Golfo de Santa Clara", ubicacion: "Malecon Turistico S/N", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 3, dia: "Viernes", fecha: "2026-02-20" },
  { id: 20, orden_id: 1008, cliente: "Desarrollo Urbano Sonora Desierto", ubicacion: "Eje Federalismo 2100", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 4, dia: "Viernes", fecha: "2026-02-20" },
  // Sabado
  { id: 21, orden_id: 1002, cliente: "Eventos Rio Colorado", ubicacion: "Blvd. Luis Donaldo Colosio 455", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 2, dia: "Sabado", fecha: "2026-02-21" },
  { id: 22, orden_id: 1005, cliente: "Festival del Golfo de Santa Clara", ubicacion: "Malecon Turistico S/N", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 3, dia: "Sabado", fecha: "2026-02-21" },
  // Domingo
  { id: 23, orden_id: 1002, cliente: "Eventos Rio Colorado", ubicacion: "Blvd. Luis Donaldo Colosio 455", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 2, dia: "Domingo", fecha: "2026-02-22" },
  { id: 24, orden_id: 1005, cliente: "Festival del Golfo de Santa Clara", ubicacion: "Malecon Turistico S/N", notas: "", estatus: "pendiente", evidencia1: null, evidencia2: null, evidencia3: null, evidencia4: null, evidencia5: null, firma: null, hora_firma: null, ruta: 3, dia: "Domingo", fecha: "2026-02-22" },
]

export { diasSemana }
