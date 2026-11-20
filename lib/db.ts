import { Pool } from "pg"

declare global {
  var __pgPool: Pool | undefined
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL

const sslMode = process.env.PGSSLMODE?.toLowerCase()
const sslConfig =
  sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full"
    ? { rejectUnauthorized: false }
    : sslMode
      ? false
      : undefined

const connectionConfig = connectionString
  ? {
      connectionString,
      ...(sslConfig === undefined ? {} : { ssl: sslConfig }),
    }
  : {
      host: process.env.PGHOST,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD ?? "",
      ssl: sslConfig ?? false,
    }

export const pool = global.__pgPool ?? new Pool(connectionConfig)

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool
}
