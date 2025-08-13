import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quem indicar?",
  description: "Sistema de gerenciamento de prestadores de serviços",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
            {children}
            <Toaster />
      </body>
      {/* Script do Google Analytics */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-4PCZ0WNE6Q"
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4PCZ0WNE6Q');
        `}
      </Script>
    </html>
  )
}
