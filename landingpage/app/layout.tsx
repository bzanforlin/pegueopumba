import type React from "react"
import type { Metadata } from "next"
import { Jura } from "next/font/google"
import "./globals.css"

const jura = Jura({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jura",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Pegue o Pumba - Alerta de Javalis",
  description: "Sistema de alerta comunitário para avistamentos de javalis",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={jura.variable}>
      <head>
        <style>{`
html {
  font-family: ${jura.style.fontFamily};
  --font-sans: ${jura.variable};
  --font-mono: ${jura.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
