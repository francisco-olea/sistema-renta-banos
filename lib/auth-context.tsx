"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"

interface AuthState {
  isAuthenticated: boolean
  user: string | null
  login: (user: string, pass: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const DEMO_USER = "admin"
const DEMO_PASS = "admin123"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<string | null>(null)

  const login = (username: string, password: string): boolean => {
    if (username === DEMO_USER && password === DEMO_PASS) {
      setIsAuthenticated(true)
      setUser(username)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
