import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { AppProvider } from '@/lib/app-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Servicios de Renta - Gestion de Renta de Banos Portátiles',
  description: 'Sistema de gestion de renta de banos portátiles. Controla ordenes, rutas, pagos, clientes y reportes.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo%20sp.ico',
        type: 'image/x-icon',
      },
      {
        url: '/logo%20sp.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: '/logo%20sp.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
