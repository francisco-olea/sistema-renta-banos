import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { diasSemana, type Frecuencia } from "@/lib/data"

export const runtime = "nodejs"

type Entity = "clientes" | "productos" | "ordenes" | "pagos"

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function parseFrecuenciaDays(frecuencia: Frecuencia) {
  const normalized = normalizeText(frecuencia || "")
  if (normalized.includes("todos los dias")) return [...diasSemana]

  const days = diasSemana.filter((day) => normalized.includes(normalizeText(day)))
  return days.length > 0 ? days : ["Lunes"]
}

async function getAllState() {
  const clientesRes = await pool.query(`
    SELECT id, nombre,
      COALESCE(telefono, '') AS telefono,
      COALESCE(email, '') AS email,
      COALESCE(empresa, '') AS empresa,
      COALESCE(rfc, '') AS rfc,
      domicilio,
      created_at::text AS created_at
    FROM renta.clientes
    ORDER BY id
  `)

  const productosRes = await pool.query(`
    SELECT id, nombre, descripcion, precio_renta, stock, activo,
      color, notas, eje, medida, tanques, agua, drenaje, tablones, ruedas, tiempo
    FROM renta.productos
    ORDER BY id
  `)

  const ordenesRes = await pool.query(`
    SELECT id,
      COALESCE(cliente_id, 0) AS cliente_id,
      cliente_nombre,
      tipo::text AS tipo,
      estado::text AS estado,
      renta,
      producto,
      cantidad,
      ruta,
      frecuencia,
      domicilio,
      map_lat,
      map_lng,
      fecha_inicio::text AS fecha_inicio,
      fecha_fin::text AS fecha_fin,
      COALESCE(notas, '') AS notas,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM renta.ordenes
    ORDER BY id
  `)

  const pagosRes = await pool.query(`
    SELECT id,
      orden_id,
      cliente_nombre,
      monto,
      metodo::text AS metodo,
      COALESCE(fecha::text, '') AS fecha,
      concepto,
      estatus::text AS estatus
    FROM renta.pagos
    ORDER BY id
  `)

  const registrosRutaRes = await pool.query(`
    SELECT id,
      orden_id,
      cliente,
      ubicacion,
      map_lat,
      map_lng,
      COALESCE(notas, '') AS notas,
      estatus::text AS estatus,
      evidencia1,
      evidencia2,
      evidencia3,
      evidencia4,
      evidencia5,
      firma,
      COALESCE(hora_firma::text, NULL) AS hora_firma,
      ruta,
      dia,
      fecha::text AS fecha
    FROM renta.registros_ruta
    ORDER BY id
  `)

  const rutas = Array.from(
    new Set([
      ...ordenesRes.rows.map((o) => Number(o.ruta)),
      ...registrosRutaRes.rows.map((r) => Number(r.ruta)),
    ])
  ).sort((a, b) => a - b)

  return {
    clientes: clientesRes.rows,
    productos: productosRes.rows,
    ordenes: ordenesRes.rows,
    pagos: pagosRes.rows,
    registrosRuta: registrosRutaRes.rows,
    rutas: rutas.length > 0 ? rutas : [1],
  }
}

export async function GET() {
  try {
    const data = await getAllState()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error GET /api/state:", error)
    return NextResponse.json({ error: "Error al leer datos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const entity = body.entity as Entity
  const data = body.data ?? {}

  try {
    if (entity === "clientes") {
      await pool.query(
        `
          INSERT INTO renta.clientes (id, nombre, telefono, email, empresa, rfc, domicilio, created_at)
          VALUES (
            COALESCE((SELECT MAX(id) + 1 FROM renta.clientes), 1),
            $1, $2, $3, $4, $5, $6, CURRENT_DATE
          )
        `,
        [
          data.nombre,
          data.telefono || "",
          data.email || "",
          data.empresa || "",
          data.rfc || "",
          data.domicilio,
        ]
      )
    } else if (entity === "productos") {
      await pool.query(
        `
          INSERT INTO renta.productos (
            id, nombre, descripcion, precio_renta, stock, activo, color, notas,
            eje, medida, tanques, agua, drenaje, tablones, ruedas, tiempo
          )
          VALUES (
            COALESCE((SELECT MAX(id) + 1 FROM renta.productos), 1),
            $1, $2, $3, $4, $5, NULLIF($6, ''), NULLIF($7, ''),
            NULLIF($8, ''), NULLIF($9, ''), $10, $11, $12, $13, $14, $15
          )
        `,
        [
          data.nombre,
          data.descripcion,
          data.precio_renta,
          data.stock,
          Boolean(data.activo),
          data.color || "",
          data.notas || "",
          data.eje || "",
          data.medida || "",
          data.tanques ?? null,
          data.agua ?? null,
          data.drenaje ?? null,
          data.tablones ?? null,
          data.ruedas ?? null,
          data.tiempo ?? null,
        ]
      )
    } else if (entity === "ordenes") {
      const client = await pool.connect()
      try {
        await client.query("BEGIN")

        const ordenInsert = await client.query(
          `
            INSERT INTO renta.ordenes (
              id, cliente_id, cliente_nombre, tipo, estado, renta, producto, cantidad, ruta,
              frecuencia, domicilio, map_lat, map_lng, fecha_inicio, fecha_fin, notas, created_at, updated_at
            )
            VALUES (
              COALESCE((SELECT MAX(id) + 1 FROM renta.ordenes), 1001),
              NULLIF($1, 0), $2, $3::renta.tipo_orden, $4::renta.estado_orden, $5, $6, $7, $8,
              $9, $10, $11, $12, $13::date, NULLIF($14, '')::date, COALESCE($15, ''), CURRENT_DATE, CURRENT_DATE
            )
            RETURNING id
          `,
          [
            Number(data.cliente_id ?? 0),
            data.cliente_nombre,
            data.tipo,
            data.estado,
            data.renta,
            data.producto,
            data.cantidad,
            data.ruta,
            data.frecuencia,
            data.domicilio,
            data.map_lat ?? null,
            data.map_lng ?? null,
            data.fecha_inicio,
            data.fecha_fin || "",
            data.notas || "",
          ]
        )

        const ordenId = ordenInsert.rows[0].id as number
        const days = parseFrecuenciaDays(data.frecuencia || "")

        for (const day of days) {
          await client.query(
            `
              INSERT INTO renta.registros_ruta (
                id, orden_id, cliente, ubicacion, map_lat, map_lng, notas, estatus,
                evidencia1, evidencia2, evidencia3, evidencia4, evidencia5,
                firma, hora_firma, ruta, dia, fecha
              )
              VALUES (
                COALESCE((SELECT MAX(id) + 1 FROM renta.registros_ruta), 1),
                $1, $2, $3, $4, $5, COALESCE($6, ''), 'pendiente'::renta.estatus_ruta,
                NULL, NULL, NULL, NULL, NULL,
                NULL, NULL, $7, $8, CURRENT_DATE
              )
            `,
            [
              ordenId,
              data.cliente_nombre,
              data.domicilio,
              data.map_lat ?? null,
              data.map_lng ?? null,
              data.notas || "",
              data.ruta,
              day,
            ]
          )
        }

        await client.query("COMMIT")
      } catch (error) {
        await client.query("ROLLBACK")
        throw error
      } finally {
        client.release()
      }
    } else if (entity === "pagos") {
      await pool.query(
        `
          INSERT INTO renta.pagos (id, orden_id, cliente_nombre, monto, metodo, fecha, concepto, estatus)
          VALUES (
            COALESCE((SELECT MAX(id) + 1 FROM renta.pagos), 1),
            $1, $2, $3, $4::renta.metodo_pago, NULLIF($5, '')::date, $6, $7::renta.estatus_pago
          )
        `,
        [
          data.orden_id,
          data.cliente_nombre,
          data.monto,
          data.metodo,
          data.fecha || "",
          data.concepto,
          data.estatus,
        ]
      )
    } else {
      return NextResponse.json({ error: "Entidad no soportada" }, { status: 400 })
    }

    const fresh = await getAllState()
    return NextResponse.json(fresh)
  } catch (error) {
    console.error("Error POST /api/state:", error)
    return NextResponse.json({ error: "Error al crear registro" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const entity = body.entity as Entity
  const id = Number(body.id)
  const data = body.data ?? {}

  try {
    if (entity === "clientes") {
      await pool.query(
        `
          UPDATE renta.clientes
          SET nombre = $1,
              telefono = $2,
              email = $3,
              empresa = $4,
              rfc = $5,
              domicilio = $6
          WHERE id = $7
        `,
        [
          data.nombre,
          data.telefono || "",
          data.email || "",
          data.empresa || "",
          data.rfc || "",
          data.domicilio,
          id,
        ]
      )
    } else if (entity === "productos") {
      await pool.query(
        `
          UPDATE renta.productos
          SET nombre = $1,
              descripcion = $2,
              precio_renta = $3,
              stock = $4,
              activo = $5,
              color = NULLIF($6, ''),
              notas = NULLIF($7, ''),
              eje = NULLIF($8, ''),
              medida = NULLIF($9, ''),
              tanques = $10,
              agua = $11,
              drenaje = $12,
              tablones = $13,
              ruedas = $14,
              tiempo = $15
          WHERE id = $16
        `,
        [
          data.nombre,
          data.descripcion,
          data.precio_renta,
          data.stock,
          Boolean(data.activo),
          data.color || "",
          data.notas || "",
          data.eje || "",
          data.medida || "",
          data.tanques ?? null,
          data.agua ?? null,
          data.drenaje ?? null,
          data.tablones ?? null,
          data.ruedas ?? null,
          data.tiempo ?? null,
          id,
        ]
      )
    } else if (entity === "ordenes") {
      const client = await pool.connect()
      try {
        await client.query("BEGIN")

        await client.query(
          `
            UPDATE renta.ordenes
            SET cliente_id = NULLIF($1, 0),
                cliente_nombre = $2,
                tipo = $3::renta.tipo_orden,
                estado = $4::renta.estado_orden,
                renta = $5,
                producto = $6,
                cantidad = $7,
                ruta = $8,
                frecuencia = $9,
                domicilio = $10,
                map_lat = $11,
                map_lng = $12,
                fecha_inicio = $13::date,
                fecha_fin = NULLIF($14, '')::date,
                notas = COALESCE($15, ''),
                updated_at = CURRENT_DATE
            WHERE id = $16
          `,
          [
            Number(data.cliente_id ?? 0),
            data.cliente_nombre,
            data.tipo,
            data.estado,
            data.renta,
            data.producto,
            data.cantidad,
            data.ruta,
            data.frecuencia,
            data.domicilio,
            data.map_lat ?? null,
            data.map_lng ?? null,
            data.fecha_inicio,
            data.fecha_fin || "",
            data.notas || "",
            id,
          ]
        )

        await client.query(
          `
            UPDATE renta.registros_ruta
            SET cliente = $1,
                ubicacion = $2,
                map_lat = $3,
                map_lng = $4,
                notas = COALESCE($5, ''),
                ruta = $6
            WHERE orden_id = $7
          `,
          [
            data.cliente_nombre,
            data.domicilio,
            data.map_lat ?? null,
            data.map_lng ?? null,
            data.notas || "",
            data.ruta,
            id,
          ]
        )

        await client.query("COMMIT")
      } catch (error) {
        await client.query("ROLLBACK")
        throw error
      } finally {
        client.release()
      }
    } else if (entity === "pagos") {
      await pool.query(
        `
          UPDATE renta.pagos
          SET orden_id = $1,
              cliente_nombre = $2,
              monto = $3,
              metodo = $4::renta.metodo_pago,
              fecha = NULLIF($5, '')::date,
              concepto = $6,
              estatus = $7::renta.estatus_pago
          WHERE id = $8
        `,
        [
          data.orden_id,
          data.cliente_nombre,
          data.monto,
          data.metodo,
          data.fecha || "",
          data.concepto,
          data.estatus,
          id,
        ]
      )
    } else {
      return NextResponse.json({ error: "Entidad no soportada" }, { status: 400 })
    }

    const fresh = await getAllState()
    return NextResponse.json(fresh)
  } catch (error) {
    console.error("Error PATCH /api/state:", error)
    return NextResponse.json({ error: "Error al actualizar registro" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const entity = body.entity as Entity
  const id = Number(body.id)

  try {
    if (entity === "clientes") {
      await pool.query("DELETE FROM renta.clientes WHERE id = $1", [id])
    } else if (entity === "productos") {
      await pool.query("DELETE FROM renta.productos WHERE id = $1", [id])
    } else if (entity === "ordenes") {
      await pool.query("DELETE FROM renta.ordenes WHERE id = $1", [id])
    } else if (entity === "pagos") {
      await pool.query("DELETE FROM renta.pagos WHERE id = $1", [id])
    } else {
      return NextResponse.json({ error: "Entidad no soportada" }, { status: 400 })
    }

    const fresh = await getAllState()
    return NextResponse.json(fresh)
  } catch (error) {
    console.error("Error DELETE /api/state:", error)
    return NextResponse.json({ error: "Error al eliminar registro" }, { status: 500 })
  }
}
