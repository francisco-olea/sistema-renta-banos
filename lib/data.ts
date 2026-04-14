// Types and demo data simulating PostgreSQL tables

export type EstadoOrden = "activo" | "terminado" | "cancelado"
export type TipoOrden = "Obra" | "Evento" | "Otro"
export type Producto = "Bano" | "Lavamanos"
export type RutaNum = 1 | 2 | 3 | 4
export type Frecuencia = string
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
  map_lat?: number | null
  map_lng?: number | null
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
  color?: string
  notas?: string
  eje?: string
  medida?: string
  tanques?: number
  agua?: number
  drenaje?: number
  tablones?: number
  ruedas?: number
  tiempo?: number
}

export interface RegistroRuta {
  id: number
  orden_id: number
  cliente: string
  ubicacion: string
  map_lat?: number | null
  map_lng?: number | null
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
  { id: 1, nombre: "Flores y Sifuentes", telefono: "", email: "", empresa: "Flores y Sifuentes", rfc: "", domicilio: "Av. Juarez y 28", created_at: "2026-04-09" },
  { id: 2, nombre: "Calú Sushi", telefono: "", email: "", empresa: "Calú Sushi", rfc: "", domicilio: "Hidalgo y 24", created_at: "2026-04-09" },
  { id: 3, nombre: "816 Arquitectos", telefono: "", email: "", empresa: "816 Arquitectos", rfc: "", domicilio: "Ejido Islita", created_at: "2026-04-09" },
  { id: 4, nombre: "M+Q", telefono: "", email: "", empresa: "M+Q", rfc: "", domicilio: "Parque Industrial Daewoo", created_at: "2026-04-09" },
  { id: 5, nombre: "Carlos Vanegas", telefono: "", email: "", empresa: "Carlos Vanegas", rfc: "", domicilio: "Empaque", created_at: "2026-04-09" },
  { id: 6, nombre: "Ameron", telefono: "", email: "", empresa: "Ameron", rfc: "", domicilio: "Carretera Sonoyta / NW Pipe", created_at: "2026-04-09" },
  { id: 7, nombre: "Hr Electro Servicios", telefono: "", email: "", empresa: "Hr Electro Servicios", rfc: "", domicilio: "Carretera Mexicali", created_at: "2026-04-09" },
  { id: 8, nombre: "Holiday Inn / Ingeniería y desarrollos urbanos", telefono: "", email: "", empresa: "Holiday Inn / Ingeniería y desarrollos urbanos", rfc: "", domicilio: "Av. Obregón", created_at: "2026-04-09" },
  { id: 9, nombre: "Adrian Meza / 653 283 1955", telefono: "", email: "", empresa: "Adrian Meza", rfc: "", domicilio: "Av. Nayarit y calle 27 #2700", created_at: "2026-04-09" },
  { id: 10, nombre: "Antonio Campas ", telefono: "", email: "", empresa: "Antonio Campas ", rfc: "", domicilio: "Jalisco y Avetos", created_at: "2026-04-09" },
  { id: 11, nombre: "Gastón Tapia Hijo", telefono: "", email: "", empresa: "Gastón Tapia Hijo", rfc: "", domicilio: "Cerrada Zaragoza entre 2 y 3", created_at: "2026-04-09" },
  { id: 12, nombre: "Edga Gamez / 001 928 398 0702", telefono: "", email: "", empresa: "Edga Gamez", rfc: "", domicilio: "Av. Taulipas 28 y 29 #2805, casa ginda cerco blanco", created_at: "2026-04-09" },
  { id: 13, nombre: "Eléctrica Díaz", telefono: "", email: "", empresa: "Eléctrica Díaz", rfc: "", domicilio: "Hidalgo y Primera", created_at: "2026-04-09" },
  { id: 14, nombre: "Benjamin Cadena", telefono: "", email: "", empresa: "Benjamin Cadena", rfc: "", domicilio: "Chihuahua y Soto", created_at: "2026-04-09" },
  { id: 15, nombre: "Manuel Medina", telefono: "", email: "", empresa: "Manuel Medina", rfc: "", domicilio: "Tamaulipas y 11, esquina noroeste", created_at: "2026-04-09" },
  { id: 16, nombre: "Fernanda Felix / 653 136 8045", telefono: "", email: "", empresa: "Fernanda Felix", rfc: "", domicilio: "Escalonias 11 y 12 / barda ladrillo, porton herrería", created_at: "2026-04-09" },
  { id: 17, nombre: "Lido Camacho", telefono: "", email: "", empresa: "Lido Camacho", rfc: "", domicilio: "Hortencias y 12 ", created_at: "2026-04-09" },
  { id: 18, nombre: "RESERVAS TERRITORIALES", telefono: "", email: "", empresa: "RESERVAS TERRITORIALES", rfc: "", domicilio: "Frente a UT", created_at: "2026-04-09" },
  { id: 19, nombre: "Kohmi Textilera", telefono: "", email: "", empresa: "Kohmi Textilera", rfc: "", domicilio: "Parque Industrial", created_at: "2026-04-09" },
  { id: 20, nombre: "Hidrogas", telefono: "", email: "", empresa: "Hidrogas", rfc: "", domicilio: "Av. Puebla y 7", created_at: "2026-04-09" },
  { id: 21, nombre: "Fortunato Ortiz", telefono: "", email: "", empresa: "Fortunato Ortiz", rfc: "", domicilio: "16 de septiembre y 45 en la esquina", created_at: "2026-04-09" },
  { id: 22, nombre: "Fortunato Ortiz", telefono: "", email: "", empresa: "Fortunato Ortiz", rfc: "", domicilio: "COAHUILA A Y 46", created_at: "2026-04-09" },
  { id: 23, nombre: "Jesus Palominos", telefono: "", email: "", empresa: "Jesus Palominos", rfc: "", domicilio: "Laureles", created_at: "2026-04-09" },
  { id: 24, nombre: "Vicente Zuno", telefono: "", email: "", empresa: "Vicente Zuno", rfc: "", domicilio: "Av. Felix Contreras y 32", created_at: "2026-04-09" },
  { id: 25, nombre: "Kristofer Gonzalez 653 127 7822", telefono: "", email: "", empresa: "Kristofer Gonzalez 653 127 7822", rfc: "", domicilio: "Mérida A 29 y 30", created_at: "2026-04-09" },
  { id: 26, nombre: "Melissa Ramirez", telefono: "", email: "", empresa: "Melissa Ramirez", rfc: "", domicilio: "Reservas Territoriales", created_at: "2026-04-09" },
  { id: 27, nombre: "Ivan Bernal / 653 106 9091", telefono: "", email: "", empresa: "Ivan Bernal", rfc: "", domicilio: "Tamaulipas 34-35", created_at: "2026-04-09" },
  { id: 28, nombre: "Josue Esau / Inco", telefono: "", email: "", empresa: "Josue Esau / Inco", rfc: "", domicilio: "Cjon Sonora 14 y 15", created_at: "2026-04-09" },
  { id: 29, nombre: "Gasolinera Bonfil", telefono: "", email: "", empresa: "Gasolinera Bonfil", rfc: "", domicilio: "Carretera al Valle", created_at: "2026-04-09" },
  { id: 30, nombre: "Antonio Morales / 653 127 5881", telefono: "", email: "", empresa: "Antonio Morales", rfc: "", domicilio: "Cjon Kino y Cuahutemoc", created_at: "2026-04-09" },
  { id: 31, nombre: "Hector Encinas", telefono: "", email: "", empresa: "Hector Encinas", rfc: "", domicilio: "Kino y 23", created_at: "2026-04-09" },
  { id: 32, nombre: "Cesar Castro / 653 177 9121", telefono: "", email: "", empresa: "Cesar Castro", rfc: "", domicilio: "Cjon Zaragoza 12 y 13, acera norte", created_at: "2026-04-09" },
  { id: 33, nombre: "Inmobiliria Eloy Carmelo / Imss", telefono: "", email: "", empresa: "Inmobiliria Eloy Carmelo / Imss", rfc: "", domicilio: "Imss parque Industrial", created_at: "2026-04-09" },
  { id: 34, nombre: "Gaston Tapia ", telefono: "", email: "", empresa: "Gaston Tapia ", rfc: "", domicilio: "Zaragoza 22-23 acera sur", created_at: "2026-04-09" },
  { id: 35, nombre: "Francisco Olea", telefono: "", email: "", empresa: "Francisco Olea", rfc: "", domicilio: "Cjon. Internacional 22 y 23", created_at: "2026-04-09" },
  { id: 36, nombre: "Gustavo Higuera / 653 130 6632 / Jorge Arce", telefono: "", email: "", empresa: "Gustavo Higuera / Jorge Arce", rfc: "", domicilio: "Callejón Guadalupe Victoria entra calle 9 y 10 lado sur", created_at: "2026-04-09" },
  { id: 37, nombre: "Guadalupe Santa Cruz", telefono: "", email: "", empresa: "Guadalupe Santa Cruz", rfc: "", domicilio: "Cjón Juarez 27 y 28", created_at: "2026-04-09" },
  { id: 38, nombre: "Marcos Núñez", telefono: "", email: "", empresa: "Marcos Núñez", rfc: "", domicilio: "Av. Francisco sarabia y calle brasil, frente a afora 2", created_at: "2026-04-09" },
  { id: 39, nombre: "816 Arquitectos", telefono: "", email: "", empresa: "816 Arquitectos", rfc: "", domicilio: "Cerca de Rancho Gomez", created_at: "2026-04-09" },
  { id: 40, nombre: "Grupo Centra", telefono: "", email: "", empresa: "Grupo Centra", rfc: "", domicilio: "Quintana Roo y 26", created_at: "2026-04-09" },
  { id: 41, nombre: "Blas Mechanical", telefono: "", email: "", empresa: "Blas Mechanical", rfc: "", domicilio: "Holiday Inn", created_at: "2026-04-09" },
  { id: 42, nombre: "Ubora", telefono: "", email: "", empresa: "Ubora", rfc: "", domicilio: "Flex Parque Industrial", created_at: "2026-04-09" },
  { id: 43, nombre: "Rivera Gas", telefono: "", email: "", empresa: "Rivera Gas", rfc: "", domicilio: "Av. Jalapa y 41", created_at: "2026-04-09" },
]

export const productosData: ProductoItem[] = [
  { id: 1, nombre: "Baño Portátil Estándar", descripcion: "Baño portátil tipo estándar con tanque de 250L", precio_renta: 1500, stock: 50, activo: true, color: "Azul", notas: "Tanque de 250L" },
  { id: 2, nombre: "Lavamanos Portátil", descripcion: "Estación de lavamanos portátil con depósito de agua", precio_renta: 800, stock: 20, activo: true, color: "Gris", notas: "Incluye depósito de agua" },
  { id: 3, nombre: "Caseta", descripcion: "Caseta para renta con configuración personalizable", precio_renta: 2200, stock: 6, activo: true, color: "", notas: "", eje: "", medida: "", tanques: undefined, agua: undefined, drenaje: undefined },
  { id: 4, nombre: "Andiamos", descripcion: "Andamio para renta con accesorios configurables", precio_renta: 950, stock: 12, activo: true, color: "", notas: "", tablones: undefined, ruedas: undefined, tiempo: undefined },
]

export const ordenesData: Orden[] = [
  { id: 1001, cliente_id: 1, cliente_nombre: "Flores y Sifuentes", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Av. Juarez y 28", fecha_inicio: "2026-02-02", fecha_fin: "2026-03-02", notas: "", created_at: "2026-02-02", updated_at: "2026-02-02" },
  { id: 1002, cliente_id: 2, cliente_nombre: "Calú Sushi", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Hidalgo y 24", fecha_inicio: "2026-02-05", fecha_fin: "2026-03-05", notas: "", created_at: "2026-02-05", updated_at: "2026-02-05" },
  { id: 1003, cliente_id: 3, cliente_nombre: "816 Arquitectos", tipo: "Obra", estado: "activo", renta: 2000, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Ejido Islita", fecha_inicio: "2026-02-11", fecha_fin: "2026-03-11", notas: "", created_at: "2026-02-11", updated_at: "2026-02-11" },
  { id: 1004, cliente_id: 4, cliente_nombre: "M+Q", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Parque Industrial Daewoo", fecha_inicio: "2026-02-12", fecha_fin: "2026-03-12", notas: "", created_at: "2026-02-12", updated_at: "2026-02-12" },
  { id: 1005, cliente_id: 5, cliente_nombre: "Carlos Vanegas", tipo: "Obra", estado: "activo", renta: 7500, producto: "Baño portatil", cantidad: 5, ruta: 1, frecuencia: "Lunes", domicilio: "Empaque", fecha_inicio: "2026-02-12", fecha_fin: "2026-03-12", notas: "Paga al fin de mes", created_at: "2026-02-12", updated_at: "2026-02-12" },
  { id: 1006, cliente_id: 6, cliente_nombre: "Ameron", tipo: "Obra", estado: "activo", renta: 6000, producto: "Baño portatil", cantidad: 3, ruta: 1, frecuencia: "Lunes", domicilio: "Carretera Sonoyta / NW Pipe", fecha_inicio: "2026-02-06", fecha_fin: "2026-03-13", notas: "", created_at: "2026-02-06", updated_at: "2026-02-06" },
  { id: 1007, cliente_id: 7, cliente_nombre: "Hr Electro Servicios", tipo: "Obra", estado: "activo", renta: 7200, producto: "Baño portatil", cantidad: 2, ruta: 1, frecuencia: "Lunes", domicilio: "Carretera Mexicali", fecha_inicio: "2026-02-15", fecha_fin: "2026-03-15", notas: "", created_at: "2026-02-15", updated_at: "2026-02-15" },
  { id: 1008, cliente_id: 8, cliente_nombre: "Holiday Inn / Ingeniería y desarrollos urbanos", tipo: "Obra", estado: "activo", renta: 7800, producto: "Baño portatil", cantidad: 3, ruta: 1, frecuencia: "Lunes", domicilio: "Av. Obregón", fecha_inicio: "2026-02-18", fecha_fin: "2026-03-18", notas: "", created_at: "2026-02-18", updated_at: "2026-02-18" },
  { id: 1009, cliente_id: 9, cliente_nombre: "Adrian Meza / 653 283 1955", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Av. Nayarit y calle 27 #2700 esquina. Departamentos beige cocheras herrería color negro", fecha_inicio: "2026-02-19", fecha_fin: "2026-03-19", notas: "", created_at: "2026-02-19", updated_at: "2026-02-19" },
  { id: 1010, cliente_id: 43, cliente_nombre: "Rivera Gas", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Av. Jalapa y 41", fecha_inicio: "2026-02-20", fecha_fin: "2026-03-20", notas: "", created_at: "2026-02-20", updated_at: "2026-02-20" },
  { id: 1011, cliente_id: 10, cliente_nombre: "Antonio Campas", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Jalisco y Avetos", fecha_inicio: "2026-02-20", fecha_fin: "2026-03-20", notas: "", created_at: "2026-02-20", updated_at: "2026-02-20" },
  { id: 1012, cliente_id: 11, cliente_nombre: "Gastón Tapia Hijo", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Cerrada Zaragoza entre 2 y 3", fecha_inicio: "2026-02-23", fecha_fin: "2026-03-23", notas: "", created_at: "2026-02-23", updated_at: "2026-02-23" },
  { id: 1013, cliente_id: 12, cliente_nombre: "Edga Gamez / 001 928 398 0702", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Av. Taulipas 28 y 29 #2805, casa ginda cerco blanco", fecha_inicio: "2026-02-24", fecha_fin: "2026-03-24", notas: "", created_at: "2026-02-24", updated_at: "2026-02-24" },
  { id: 1014, cliente_id: 13, cliente_nombre: "Eléctrica Díaz", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Hidalgo y Primera", fecha_inicio: "2026-02-24", fecha_fin: "2026-03-24", notas: "", created_at: "2026-02-24", updated_at: "2026-02-24" },
  { id: 1015, cliente_id: 14, cliente_nombre: "Benjamin Cadena", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Chihuahua y Soto", fecha_inicio: "2026-02-25", fecha_fin: "2026-03-25", notas: "", created_at: "2026-02-25", updated_at: "2026-02-25" },
  { id: 1016, cliente_id: 15, cliente_nombre: "Manuel Medina", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Tamaulipas y 11, esquina noroeste", fecha_inicio: "2026-02-27", fecha_fin: "2026-03-27", notas: "", created_at: "2026-02-27", updated_at: "2026-02-27" },
  { id: 1017, cliente_id: 16, cliente_nombre: "Fernanda Felix / 653 136 8045", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Escalonias 11 y 12 / barda ladrillo, porton herrería", fecha_inicio: "2026-02-27", fecha_fin: "2026-03-27", notas: "", created_at: "2026-02-27", updated_at: "2026-02-27" },
  { id: 1018, cliente_id: 17, cliente_nombre: "Lido Camacho", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Hortencias y 12 ", fecha_inicio: "2026-02-28", fecha_fin: "2026-03-28", notas: "", created_at: "2026-02-28", updated_at: "2026-02-28" },
  { id: 1019, cliente_id: 18, cliente_nombre: "RESERVAS TERRITORIALES", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Frente a UT", fecha_inicio: "2026-02-28", fecha_fin: "2026-03-28", notas: "", created_at: "2026-02-28", updated_at: "2026-02-28" },
  { id: 1020, cliente_id: 19, cliente_nombre: "Kohmi Textilera", tipo: "Obra", estado: "activo", renta: 1400, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Parque Industrial", fecha_inicio: "2026-02-28", fecha_fin: "2026-03-28", notas: "", created_at: "2026-02-28", updated_at: "2026-02-28" },
  { id: 1021, cliente_id: 20, cliente_nombre: "Hidrogas", tipo: "Obra", estado: "activo", renta: 1500, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Av. Puebla y 7", fecha_inicio: "2026-03-01", fecha_fin: "2026-04-01", notas: "", created_at: "2026-03-01", updated_at: "2026-03-01" },
  { id: 1022, cliente_id: 21, cliente_nombre: "Fortunato Ortiz", tipo: "Obra", estado: "activo", renta: 1300, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "16 de septiembre y 45 en la esquina", fecha_inicio: "2026-03-02", fecha_fin: "2026-04-02", notas: "", created_at: "2026-03-02", updated_at: "2026-03-02" },
  { id: 1023, cliente_id: 21, cliente_nombre: "Fortunato Ortiz", tipo: "Obra", estado: "activo", renta: 1300, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "COAHUILA A Y 46", fecha_inicio: "2026-03-02", fecha_fin: "2026-04-02", notas: "", created_at: "2026-03-02", updated_at: "2026-03-02" },
  { id: 1024, cliente_id: 23, cliente_nombre: "Jesus Palominos", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Laureles", fecha_inicio: "2026-03-02", fecha_fin: "2026-04-02", notas: "", created_at: "2026-03-02", updated_at: "2026-03-02" },
  { id: 1025, cliente_id: 24, cliente_nombre: "Vicente Zuno", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Av. Felix Contreras y 32", fecha_inicio: "2026-03-03", fecha_fin: "2026-04-03", notas: "Paga al fin de mes", created_at: "2026-03-03", updated_at: "2026-03-03" },
  { id: 1026, cliente_id: 25, cliente_nombre: "Kristofer Gonzalez 653 127 7822", tipo: "Obra", estado: "activo", renta: 2600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Mérida A 29 y 30", fecha_inicio: "2026-03-04", fecha_fin: "2026-04-04", notas: "", created_at: "2026-03-04", updated_at: "2026-03-04" },
  { id: 1027, cliente_id: 26, cliente_nombre: "Melissa Ramirez", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Reservas Territoriales", fecha_inicio: "2026-03-04", fecha_fin: "2026-04-04", notas: "", created_at: "2026-03-04", updated_at: "2026-03-04" },
  { id: 1028, cliente_id: 27, cliente_nombre: "Ivan Bernal / 653 106 9091", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Tamaulipas 34-35", fecha_inicio: "2026-03-05", fecha_fin: "2026-04-05", notas: "", created_at: "2026-03-05", updated_at: "2026-03-05" },
  { id: 1029, cliente_id: 28, cliente_nombre: "Josue Esau / Inco", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Cjon Sonora 14 y 15", fecha_inicio: "2026-03-05", fecha_fin: "2026-04-05", notas: "", created_at: "2026-03-05", updated_at: "2026-03-05" },
  { id: 1030, cliente_id: 29, cliente_nombre: "Gasolinera Bonfil", tipo: "Obra", estado: "activo", renta: 11200, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Carretera al Valle", fecha_inicio: "2026-03-05", fecha_fin: "2026-04-05", notas: "", created_at: "2026-03-05", updated_at: "2026-03-05" },
  { id: 1031, cliente_id: 30, cliente_nombre: "Antonio Morales / 653 127 5881", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Cjon Kino y Cuahutemoc", fecha_inicio: "2026-03-06", fecha_fin: "2026-04-06", notas: "", created_at: "2026-03-06", updated_at: "2026-03-06" },
  { id: 1032, cliente_id: 31, cliente_nombre: "Hector Encinas", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Kino y 23", fecha_inicio: "2026-03-06", fecha_fin: "2026-04-06", notas: "", created_at: "2026-03-06", updated_at: "2026-03-06" },
  { id: 1033, cliente_id: 32, cliente_nombre: "Cesar Castro / 653 177 9121", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Cjon Zaragoza 12 y 13, acera norte", fecha_inicio: "2026-03-06", fecha_fin: "2026-04-06", notas: "", created_at: "2026-03-06", updated_at: "2026-03-06" },
  { id: 1034, cliente_id: 33, cliente_nombre: "Inmobiliria Eloy Carmelo / Imss", tipo: "Obra", estado: "activo", renta: 39600, producto: "Baño portatil", cantidad: 11, ruta: 1, frecuencia: "Lunes", domicilio: "Imss parque Industrial", fecha_inicio: "2026-03-06", fecha_fin: "2026-04-06", notas: "Paga al fin de mes", created_at: "2026-03-06", updated_at: "2026-03-06" },
  { id: 1035, cliente_id: 34, cliente_nombre: "Gaston Tapia", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Zaragoza 22-23 acera sur", fecha_inicio: "2026-03-10", fecha_fin: "2026-04-10", notas: "", created_at: "2026-03-10", updated_at: "2026-03-10" },
  { id: 1036, cliente_id: 35, cliente_nombre: "Francisco Olea", tipo: "Obra", estado: "activo", renta: 1500, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Cjon. Internacional 22 y 23", fecha_inicio: "2026-03-10", fecha_fin: "2026-04-10", notas: "", created_at: "2026-03-10", updated_at: "2026-03-10" },
  { id: 1037, cliente_id: 36, cliente_nombre: "Gustavo Higuera / 653 130 6632 / Jorge Arce", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Callejón Guadalupe Victoria entra calle 9 y 10 lado sur", fecha_inicio: "2026-03-10", fecha_fin: "2026-04-10", notas: "", created_at: "2026-03-10", updated_at: "2026-03-10" },
  { id: 1038, cliente_id: 37, cliente_nombre: "Guadalupe Santa Cruz", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Cjón Juarez 27 y 28", fecha_inicio: "2026-03-10", fecha_fin: "2026-04-10", notas: "", created_at: "2026-03-10", updated_at: "2026-03-10" },
  { id: 1039, cliente_id: 38, cliente_nombre: "Marcos Núñez", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Av. Francisco sarabia y calle brasil, frente a afora 2", fecha_inicio: "2026-03-11", fecha_fin: "2026-04-11", notas: "", created_at: "2026-03-11", updated_at: "2026-03-11" },
  { id: 1040, cliente_id: 3, cliente_nombre: "816 Arquitectos", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Cerca de Rancho Gomez", fecha_inicio: "2026-03-11", fecha_fin: "2026-04-11", notas: "", created_at: "2026-03-11", updated_at: "2026-03-11" },
  { id: 1041, cliente_id: 40, cliente_nombre: "Grupo Centra", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Quintana Roo y 26", fecha_inicio: "2026-03-12", fecha_fin: "2026-04-12", notas: "", created_at: "2026-03-12", updated_at: "2026-03-12" },
  { id: 1042, cliente_id: 41, cliente_nombre: "Blas Mechanical", tipo: "Obra", estado: "activo", renta: 2600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Holiday Inn", fecha_inicio: "2026-03-17", fecha_fin: "2026-04-17", notas: "", created_at: "2026-03-17", updated_at: "2026-03-17" },
  { id: 1043, cliente_id: 42, cliente_nombre: "Ubora", tipo: "Obra", estado: "activo", renta: 1600, producto: "Baño portatil", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Flex Parque Industrial", fecha_inicio: "2026-01-01", fecha_fin: "2026-05-01", notas: "", created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: 1044, cliente_id: 0, cliente_nombre: "ReaClima", tipo: "Otro", estado: "activo", renta: 7000, producto: "Eje sencillo / gris", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Hospital Osmed", fecha_inicio: "2026-01-22", fecha_fin: "2026-02-22", notas: "", created_at: "2026-01-22", updated_at: "2026-01-22" },
  { id: 1045, cliente_id: 0, cliente_nombre: "Bombatec", tipo: "Otro", estado: "activo", renta: 10000, producto: "Eje sencillo", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Imss Parque industrial", fecha_inicio: "2026-02-01", fecha_fin: "2026-03-01", notas: "", created_at: "2026-02-01", updated_at: "2026-02-01" },
  { id: 1046, cliente_id: 0, cliente_nombre: "GP3 / Pedro Ochoa", tipo: "Otro", estado: "activo", renta: 9000, producto: "Doble Eje", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Sonora Star Puerto Peñasco", fecha_inicio: "2026-03-06", fecha_fin: "2026-04-06", notas: "", created_at: "2026-03-06", updated_at: "2026-03-06" },
  { id: 1047, cliente_id: 19, cliente_nombre: "Kohmi Textilera", tipo: "Otro", estado: "activo", renta: 2000, producto: "Eje sencillo", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Parque Industrial", fecha_inicio: "2026-02-28", fecha_fin: "2026-03-28", notas: "", created_at: "2026-02-28", updated_at: "2026-02-28" },
  { id: 1048, cliente_id: 0, cliente_nombre: "GDI / DIEGO LOZANO", tipo: "Otro", estado: "activo", renta: 3000, producto: "Eje sencillo", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Carretera a Sonoyta", fecha_inicio: "2026-03-01", fecha_fin: "2026-04-01", notas: "", created_at: "2026-03-01", updated_at: "2026-03-01" },
  { id: 1049, cliente_id: 25, cliente_nombre: "Kristofer Gonzalez 653 127 7822", tipo: "Otro", estado: "activo", renta: 4500, producto: "Eje sencillo", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Mérida A 29 y 30", fecha_inicio: "2026-03-04", fecha_fin: "2026-04-04", notas: "", created_at: "2026-03-04", updated_at: "2026-03-04" },
  { id: 1050, cliente_id: 0, cliente_nombre: "AIRMAT México", tipo: "Otro", estado: "activo", renta: 6500, producto: "Eje sencillo / gris", cantidad: 1, ruta: 1, frecuencia: "Lunes", domicilio: "Gonzalez Ortega / Mexicali", fecha_inicio: "2026-03-10", fecha_fin: "2026-04-10", notas: "", created_at: "2026-03-10", updated_at: "2026-03-10" },
  { id: 1051, cliente_id: 13, cliente_nombre: "Electrica Díaz", tipo: "Otro", estado: "activo", renta: 3750, producto: "Andiamos", cantidad: 7, ruta: 1, frecuencia: "Lunes", domicilio: "Hospital Osmed", fecha_inicio: "2026-03-02", fecha_fin: "2026-03-17", notas: "", created_at: "2026-03-02", updated_at: "2026-03-02" },
]

export const pagosData: Pago[] = [
  { id: 1, orden_id: 1001, cliente_nombre: "Flores y Sifuentes", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 2, orden_id: 1002, cliente_nombre: "Calú Sushi", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 3, orden_id: 1003, cliente_nombre: "816 Arquitectos", monto: 2000, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 4, orden_id: 1004, cliente_nombre: "M+Q", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 5, orden_id: 1005, cliente_nombre: "Carlos Vanegas", monto: 7500, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 6, orden_id: 1006, cliente_nombre: "Ameron", monto: 6000, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 7, orden_id: 1007, cliente_nombre: "Hr Electro Servicios", monto: 7200, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 8, orden_id: 1008, cliente_nombre: "Holiday Inn / Ingeniería y desarrollos urbanos", monto: 7800, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 9, orden_id: 1009, cliente_nombre: "Adrian Meza / 653 283 1955", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 10, orden_id: 1010, cliente_nombre: "Rivera Gas", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 11, orden_id: 1011, cliente_nombre: "Antonio Campas ", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 12, orden_id: 1012, cliente_nombre: "Gastón Tapia Hijo", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 13, orden_id: 1013, cliente_nombre: "Edga Gamez / 001 928 398 0702", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 14, orden_id: 1014, cliente_nombre: "Eléctrica Díaz", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 15, orden_id: 1015, cliente_nombre: "Benjamin Cadena", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 16, orden_id: 1016, cliente_nombre: "Manuel Medina", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 17, orden_id: 1017, cliente_nombre: "Fernanda Felix / 653 136 8045", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 18, orden_id: 1018, cliente_nombre: "Lido Camacho", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 19, orden_id: 1019, cliente_nombre: "RESERVAS TERRITORIALES", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 20, orden_id: 1020, cliente_nombre: "Kohmi Textilera", monto: 1400, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 21, orden_id: 1021, cliente_nombre: "Hidrogas", monto: 1500, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 22, orden_id: 1022, cliente_nombre: "Fortunato Ortiz", monto: 1300, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 23, orden_id: 1023, cliente_nombre: "Fortunato Ortiz", monto: 1300, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 24, orden_id: 1024, cliente_nombre: "Jesus Palominos", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 25, orden_id: 1025, cliente_nombre: "Vicente Zuno", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 26, orden_id: 1026, cliente_nombre: "Kristofer Gonzalez 653 127 7822", monto: 2600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 27, orden_id: 1027, cliente_nombre: "Melissa Ramirez", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 28, orden_id: 1028, cliente_nombre: "Ivan Bernal / 653 106 9091", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 29, orden_id: 1029, cliente_nombre: "Josue Esau / Inco", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 30, orden_id: 1030, cliente_nombre: "Gasolinera Bonfil", monto: 11200, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 31, orden_id: 1031, cliente_nombre: "Antonio Morales / 653 127 5881", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 32, orden_id: 1032, cliente_nombre: "Hector Encinas", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 33, orden_id: 1033, cliente_nombre: "Cesar Castro / 653 177 9121", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 34, orden_id: 1034, cliente_nombre: "Inmobiliria Eloy Carmelo / Imss", monto: 39600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 35, orden_id: 1035, cliente_nombre: "Gaston Tapia ", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 36, orden_id: 1036, cliente_nombre: "Francisco Olea", monto: 1500, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 37, orden_id: 1037, cliente_nombre: "Gustavo Higuera / 653 130 6632 / Jorge Arce", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 38, orden_id: 1038, cliente_nombre: "Guadalupe Santa Cruz", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 39, orden_id: 1039, cliente_nombre: "Marcos Núñez", monto: 1600, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 40, orden_id: 1040, cliente_nombre: "816 Arquitectos", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 41, orden_id: 1041, cliente_nombre: "Grupo Centra", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 42, orden_id: 1042, cliente_nombre: "Blas Mechanical", monto: 2600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 43, orden_id: 1043, cliente_nombre: "Ubora", monto: 1600, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 44, orden_id: 1044, cliente_nombre: "ReaClima", monto: 7000, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 45, orden_id: 1045, cliente_nombre: "Bombatec", monto: 10000, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pendiente" },
  { id: 46, orden_id: 1046, cliente_nombre: "GP3 / Pedro Ochoa", monto: 9000, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 47, orden_id: 1047, cliente_nombre: "Kohmi Textilera", monto: 2000, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 48, orden_id: 1048, cliente_nombre: "GDI / DIEGO LOZANO", monto: 3000, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 49, orden_id: 1049, cliente_nombre: "Kristofer Gonzalez 653 127 7822", monto: 4500, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 50, orden_id: 1050, cliente_nombre: "AIRMAT México", monto: 6500, metodo: "Transferencia", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
  { id: 51, orden_id: 1051, cliente_nombre: "Electrica Díaz", monto: 3750, metodo: "Efectivo", fecha: "", concepto: "Mes de marzo", estatus: "pagado" },
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



