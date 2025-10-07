"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { getCategories } from "@/lib/actions/categories"
import { getProviderById, updateProvider } from "@/lib/actions/providers"
import { ImageUpload } from "@/components/image-upload"
import { number } from "zod"

interface Category {
  id: number
  name: string
  providersCount: number
  createdAt: Date
  updatedAt: Date
}

interface Provider {
  id: number
  title: string
  subtitle: string | null
  category: {
    id: number
    name: string
  }
  description: string | null
  photoUrl: string | null
  phone: string
  email: string
  zipCode: string | null
  address: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  youtube: string | null
  linkedin: string | null
  tiktok: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
  averageRating: number
  ratingsCount: number
}

export default function EditarPrestadorPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[] | undefined>([])
  const [provider, setProvider] = useState<Provider | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    categoryId: "",
    description: "",
    phone: "",
    email: "",
    zipCode: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
    tiktok: "",
  })

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      const [categoriesResult, providerResult] = await Promise.all([
        getCategories(),
        getProviderById(Number(params.id)),
      ])

      // if(providerResult.data?.email !== user?.email) {
      //   router.push("/prestadores")
      // }

      if (categoriesResult.success) {
        setCategories(categoriesResult.data)
      }

      if (providerResult.success) {
        const providerData = providerResult.data
        setProvider(providerData)
        if(!providerData) {
          toast({
            title: "Erro",
            description: "Prestador não encontrado.",
            variant: "destructive",
          })
          router.push("/prestadores")
          return
        }

        setFormData({
          title: providerData.title,
          subtitle: providerData.subtitle || "",
          categoryId: providerData.category.id.toString(),
          description: providerData.description || "",
          phone: providerData.phone,
          email: providerData.email,
          zipCode: providerData.zipCode || "",
          address: providerData.address || "",
          number: providerData.number || "",
          complement: providerData.complement || "",
          neighborhood: providerData.neighborhood || "",
          city: providerData.city || "",
          state: providerData.state || "",
          website: providerData.website || "",
          instagram: providerData.instagram || "",
          facebook: providerData.facebook || "",
          youtube: providerData.youtube || "",
          linkedin: providerData.linkedin || "",
          tiktok: providerData.tiktok || "",
        })
      } else {
        toast({
          title: "Erro",
          description: providerResult.error,
          variant: "destructive",
        })
        router.push("/prestadores")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      })
      router.push("/prestadores")
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
    if (file) {
      setRemoveCurrentImage(false)
    }
  }

  const handleRemoveCurrentImage = () => {
    setRemoveCurrentImage(true)
    setSelectedImage(null)
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

      // Add provider ID
      submitFormData.append("id", params.id)

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

      // Add remove photo flag
      if (removeCurrentImage) {
        submitFormData.append("removePhoto", "true")
      }

      const result = await updateProvider(submitFormData)

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        router.push("/prestadores")
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
        description: "Erro ao atualizar prestador",
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

  if (!provider) {
    return null
  }

  return (
    <ProtectedRoute>
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
                  <h1 className="text-3xl font-bold text-white">Editar Prestador</h1>
                  <p className="text-white/80 text-sm">Atualize as informações de {provider.title}</p>
                </div>
              </div>
              <Link href="/prestadores">
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
                <div className="space-y-4">
                  <ImageUpload
                    currentImage={removeCurrentImage ? null : provider.photoUrl}
                    onImageChange={handleImageChange}
                    disabled={submitting}
                  />
                  {provider.photoUrl && !removeCurrentImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveCurrentImage}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover foto atual
                    </Button>
                  )}
                </div>

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
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="exemplo@email.com"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-2 w-full sm:w-1/5">                  
                  <Label htmlFor="zipCode">Cep</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="00000-000"                    
                  />
                </div>

                <div className="flex gap-4 w-full flex-col sm:flex-row">
                  <div className="space-y-2 w-full">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      
                    />
                  </div>
                  <div className="space-y-2 w-[120px]">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => handleInputChange("number", e.target.value)}                      
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) => handleInputChange("complement", e.target.value)}                    
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-4 w-full flex-col sm:flex-row justify-stretch">
                  <div className="space-y-2 flex-1" >
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange("neighborhood", e.target.value)}                      
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2 sm:w-[80px] w-full">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      disabled={submitting}
                    />
                  </div>
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
              <Link href="/prestadores">
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
          </form>
        </main>
      </div>
    </ProtectedRoute>
  )
}
