"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { getCategories } from "@/lib/actions/categories"
import { createProvider } from "@/lib/actions/providers"
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from "@/contexts/auth-context"

interface Category {
  id: number
  name: string
  providersCount: number
  createdAt: Date
  updatedAt: Date
}

export default function CadastroPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[] | undefined>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    categoryId: "",
    description: "",
    phone: "",
    email: user?.email || "sememail@email.com.br",
    address: "",
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
    tiktok: "",
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const result = await getCategories()
      if (result.success) {
        setCategories(result.data)
      } else {
        toast({
          title: "Ops",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ops",
        description: "Erro ao carregar categorias",
        variant: "destructive",
      })
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

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.categoryId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      // Create FormData for server action
      const submitFormData = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "categoryId") {
          submitFormData.append(key, value.toString())
        } else {
          submitFormData.append(key, value)
        }
      })

      // Add image file if selected
      if (selectedImage) {
        submitFormData.append("photo", selectedImage)
      }

      submitFormData.append("email", user?.email || "sememail@email.com.br")
      console.log("Submitting form data:", Object.fromEntries(submitFormData.entries()))

      const result = await createProvider(submitFormData)

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })

        // Reset form
        setFormData({
          title: "",
          subtitle: "",
          categoryId: "",
          description: "",
          phone: "",
          email: user?.email || "",
          address: "",
          website: "",
          instagram: "",
          facebook: "",
          youtube: "",
          linkedin: "",
          tiktok: "",
        })
        setSelectedImage(null)
      } else {
        toast({
          title: "Ops",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: {success?: boolean, toString: () => string, error: string | null} | any) {
      toast({
        title: "Ops. Encontramos um problema ao criar o prestador",
        description: {error}?.toString() || "Tente novamente mais tarde, ou entre em contato com nosso atendimento.",        
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4  justify-between">              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Cadastro de Prestador</h1>
                  <p className="text-white/80 text-sm">Adicione um novo profissional à plataforma</p>
                </div>
              </div>              
              <Link href={"/prestadores"}>
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
              <CardDescription className="px-6 mt-4 mb-8 text-sm text-gray-600">
                Ao enviar meus dados eu autorizo ao proprietário do site www.quemindicar.com.br a utilizar 
                e compartilhar minhas informações para divulgação destes dados ao público através do acesso 
                ao site www.quemindicar.com.br. Compreendo que a minha autorização é livre e pode ser revogada 
                a qualquer momento. Também assumo que li e entendi os Termos de Uso e a Política de Privacidade 
                que estão disponíveis na página de inscrição.
              </CardDescription>
              <CardContent className="space-y-6">
                {/* Upload de Foto */}
                <ImageUpload onImageChange={handleImageChange} disabled={submitting} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título/Nome *</Label>
                    <Input
                      id="titulo"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Ex: Maria Silva"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitulo">Subtítulo/Especialidade</Label>
                    <Input
                      id="subtitulo"
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange("subtitle", e.target.value)}
                      placeholder="Ex: Esteticista Especializada"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                          {categoria.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição dos Serviços</Label>
                  <Textarea
                    id="descricao"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva os serviços prestados..."
                    rows={4}
                    disabled={submitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"                      
                      value={user?.email || formData.email}                                                                  
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Rua, número, bairro, cidade, estado"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Input
                    id="site"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://seusite.com.br"
                    disabled={submitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      placeholder="@seuusuario"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange("facebook", e.target.value)}
                      placeholder="Sua Página no Facebook"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={formData.youtube}
                      onChange={(e) => handleInputChange("youtube", e.target.value)}
                      placeholder="Seu Canal no YouTube"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      placeholder="Seu perfil no LinkedIn"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                      id="tiktok"
                      value={formData.tiktok}
                      onChange={(e) => handleInputChange("tiktok", e.target.value)}
                      placeholder="@seuusuario"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4">
              <Link href="/dashboard">
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
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Prestador
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  )
}
