"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, CreditCardIcon, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserById, updateUser } from "@/lib/actions/users"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import getCustomerLink from "@/app/(auth)/subscriptions/_data-access/get-customer-link"
import { useSession } from "next-auth/react"

interface User {
  id: string
  name: string  
  email: string
  role?: string
  newPassword?: string  
  confirmPassword?: string  
  stripeCustomerId?: string | null
}

export default function CustomerEditPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [customer, setCustomer] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    newPassword: "",
    confirmPassword: "",    
  })


  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      const userResult = await getUserById(params.id)

      if (userResult.success) {        
        const customerData = userResult.data
        setCustomer(userResult.data)
        if(!userResult.data) {
          toast({
            title: "Erro",
            description: "Usuário não encontrado.",
            variant: "destructive",
          })
          router.push("/users")
          return
        }

        setFormData({
          name: customerData?.name || "",
          email: customerData?.email || "",
          role: customerData?.role || "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Erro",
          description: userResult.error,
          variant: "destructive",
        })
        router.push("/users")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      })
      router.push("/users")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Create FormData for server action
      const submitFormData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
          submitFormData.append(key, value)
      })

      // Add user ID
      submitFormData.append("id", params.id)

      console.log("Submitting FormData:", Array.from(submitFormData.entries()))

      const newPassword = submitFormData.get("newPassword") as string
      const confirmPassword = submitFormData.get("confirmPassword") as string
      
      if (newPassword !== confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive",
        })
        setSubmitting(false)
        return
      }

      if (newPassword !== "" && newPassword.length < 8) {
        toast({
          title: "Erro",
          description: "A nova senha deve ter pelo menos 8 caracteres",
          variant: "destructive",
        })
        setSubmitting(false)
        return
      }

      const result = await updateUser(submitFormData)

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        router.push(session?.user?.role==='Administrator' ? "/users" : "/dashboard")
      } else {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleGenerateCustomerLink = async (customerId: string) => {
    const url = await getCustomerLink(customerId as string)
    console.log("Generated Customer Link URL:", url)
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando...</p>
          </div>
        </div>
      
    )
  }

  if (!session?.user?.email) {
    return null
  }

  return (
    
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Save className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Editar Usuário</h1>
                  <p className="text-white/80 text-sm">Atualize as informações de {customer?.name}</p>
                </div>
              </div>
              <Link href={session?.user?.role==='Administrator' ? "/users" : "/dashboard"}>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Informações Básicas */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome<strong className="text-red-500"> *</strong></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: Maria Silva"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail*</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="exemplo@email.com"
                      required
                      disabled={session?.user?.role==='Administrator' ? false : true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Tipo de Acesso*</Label>
                    <Select onValueChange={(value) => handleInputChange("role", value)} defaultValue={formData.role} disabled={session?.user?.role==='Administrator' ? false : true}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent id="role">
                        <SelectGroup>                          
                          <SelectItem value="Administrator">Administrador</SelectItem>
                          <SelectItem value="Customer">Cliente</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>                  
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha <span className="text-[10px]">(Mínimo de 8 caracteres)</span></Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      disabled={submitting}
                      placeholder="Digite sua nova senha"
                      minLength={8}
                    />                    
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}                      
                      disabled={submitting}
                      placeholder="Confirme sua nova senha"
                      minLength={8}
                    />
                  </div>
                </div>                
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="sm:flex flex-1 justify-center gap-4 space-y-4 sm:space-y-0">              
              <Button className="flex sm:w-[200px] w-full" variant="default" title="Gerenciar Assinatura" 
                type="button"
                onClick={() => handleGenerateCustomerLink(customer?.stripeCustomerId as string)}>
                <CreditCardIcon className="w-4 h-4" />
                Gerenciar Assinatura
              </Button>
              <div className="flex gap-4 sm:justify-end justify-center flex-1 ">
                <Link href={session?.user?.role==='Administrator' ? "/users" : "/dashboard"}>
                  <Button
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-indigo-500 transition-all duration-300 bg-transparent"
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    
  )
}
