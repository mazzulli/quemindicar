import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"

export default function UserLayout({
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
