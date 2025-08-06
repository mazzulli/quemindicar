import { AuthProvider } from "@/app/AuthProvider"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}          
    </AuthProvider>        
  )
}
