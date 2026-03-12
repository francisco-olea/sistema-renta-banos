"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bubbles, Eye, EyeOff } from "lucide-react"
import { LoadingScreen } from "@/components/loading-screen"

export function LoginForm() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validar credenciales sin autenticar todavía
    const DEMO_USER = "admin"
    const DEMO_PASS = "admin123"
    
    if (username === DEMO_USER && password === DEMO_PASS) {
      // Credenciales correctas: mostrar loading screen
      setIsLoading(true)
    } else {
      setError("Usuario o contrasena incorrectos")
    }
  }

  const handleLoadingFinish = () => {
    // Autenticar al usuario después del loading
    login(username, password)
  }

  if (isLoading) {
    return <LoadingScreen onFinish={handleLoadingFinish} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Bubbles className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="mt-4 text-xl">Baños Portátiles</CardTitle>
          <CardDescription>Sistema de Gestión de Renta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Usuario
              </label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo: admin / admin123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
