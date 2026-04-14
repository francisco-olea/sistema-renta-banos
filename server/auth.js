const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Pool } = require("pg")

const app = express()
app.use(express.json())

app.get("/", (_req, res) => {
  res.send({
    ok: true,
    service: "auth",
    message: "Auth API running",
    endpoints: ["POST /signup", "POST /login", "GET /protected"],
  })
})

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "servicios_portatiles",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  ssl:
    process.env.PGSSLMODE === "require"
      ? { rejectUnauthorized: false }
      : false,
})

async function ensureUsersTable() {
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS renta;

    CREATE TABLE IF NOT EXISTS renta.users (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.sendStatus(401)
  }
}

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).send({ error: "email y password son requeridos" })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await pool.query(
      "INSERT INTO renta.users (email, password_hash) VALUES ($1, $2)",
      [email, hashedPassword]
    )

    return res.send({ message: "User created" })
  } catch (error) {
    if (error && error.code === "23505") {
      return res.status(409).send({ error: "El email ya existe" })
    }

    console.error("Error en /signup:", error)
    return res.status(500).send({ error: "No se pudo crear el usuario" })
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).send({ error: "email y password son requeridos" })
    }

    const result = await pool.query(
      "SELECT id, email, password_hash FROM renta.users WHERE email = $1",
      [email]
    )

    const user = result.rows[0]
    if (!user) return res.status(401).send("Invalid credentials")

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).send("Invalid credentials")

    if (!process.env.JWT_SECRET) {
      return res.status(500).send({ error: "Falta configurar JWT_SECRET" })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    return res.send({ token })
  } catch (error) {
    console.error("Error en /login:", error)
    return res.status(500).send({ error: "No se pudo iniciar sesion" })
  }
})

app.get("/protected", authMiddleware, (req, res) => {
  res.send({ message: "Secure data", user: req.user })
})

async function start() {
  await ensureUsersTable()
  const port = Number(process.env.AUTH_PORT || 4000)
  app.listen(port, () => {
    console.log(`Auth API lista en http://localhost:${port}`)
  })
}

if (require.main === module) {
  start().catch((error) => {
    console.error("No se pudo iniciar auth server:", error)
    process.exit(1)
  })
}

module.exports = { app, pool, ensureUsersTable }
