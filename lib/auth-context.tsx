"use client"

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AuthState {
  isAuthenticated: boolean
  isSessionRestored: boolean
  user: string | null
  login: (user: string, pass: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const DEMO_USER = "admin"
const DEMO_PASS = "admin123"
const SESSION_STORAGE_KEY = "sistema-renta-user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [isSessionRestored, setIsSessionRestored] = useState(false)

  useEffect(() => {
    const savedUser = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (savedUser === DEMO_USER) {
      setIsAuthenticated(true)
      setUser(savedUser)
    }
    setIsSessionRestored(true)
  }, [])

  const login = (username: string, password: string): boolean => {
    if (username === DEMO_USER && password === DEMO_PASS) {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, username)
      setIsAuthenticated(true)
      setUser(username)
      return true
    }
    return false
  }

  const logout = () => {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isSessionRestored, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
