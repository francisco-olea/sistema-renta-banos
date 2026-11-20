"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onFinish, 300)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [onFinish])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl bg-white">
          <Image
            src="/logo%20sp.png"
            alt="Logo de Servicios de Renta"
            width={64}
            height={64}
            className="h-14 w-14 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-primary-foreground">
          Servicios de Renta
        </h1>
        <p className="text-sm text-primary-foreground/70">Cargando sistema...</p>
      </div>
      <div className="w-48 overflow-hidden rounded-full bg-primary-foreground/20">
        <div
          className="h-1.5 rounded-full bg-primary-foreground transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
