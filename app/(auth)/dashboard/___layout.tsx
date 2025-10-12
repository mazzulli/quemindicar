'use client'
import type React from "react"
import AuthProvider from "@/app/auth-provider"

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
