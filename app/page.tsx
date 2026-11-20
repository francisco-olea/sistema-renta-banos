"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function Home() {
  const { isAuthenticated, isSessionRestored } = useAuth()

  if (!isSessionRestored) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/30" role="status">
        Restaurando sesión...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <DashboardLayout />
}
