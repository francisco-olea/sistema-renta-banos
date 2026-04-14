import { Pool } from "pg"

declare global {
  var __pgPool: Pool | undefined
}

const connectionConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: (() => {
    const mode = (process.env.PGSSLMODE || "disable").toLowerCase()
    if (mode === "require" || mode === "verify-ca" || mode === "verify-full") {
      return { rejectUnauthorized: false }
    }
    return false
  })(),
}

export const pool = global.__pgPool ?? new Pool(connectionConfig)

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool
}
