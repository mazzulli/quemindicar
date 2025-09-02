"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Phone, Mail, Globe, Instagram, Facebook, Youtube, Star, MapPin, Sparkles, LogIn, InstagramIcon, RocketIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { RatingModal } from "@/components/rating-modal"
import { getCategories } from "@/lib/actions/categories"
import { getProviders } from "@/lib/actions/providers"
import { createRating } from "@/lib/actions/ratings"
import { Pagination } from "@/components/pagination"
import logoQuemIndicar  from "../public/logo-q.png"
import { ProviderDetailsModal } from "@/components/provider-details-modal"
import { ReviewsModal } from "@/components/reviews-modal"

interface Category {
  id: number
  name: string
  providersCount: number
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
  address: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  youtube: string | null
  linkedin: string | null
  tiktok: string | null
  active: boolean
  averageRating: number
  ratingsCount: number
  createdAt: Date
  updatedAt: Date
}

export default function HomePage() {
  const [filtroNome, setFiltroNome] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("all")
  const [categories, setCategories] = useState<Category[] | undefined>([])
  const [providers, setProviders] = useState<Provider[] | undefined>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [providerId, setProviderId] = useState<number | null>(null)

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(18) // Padrão para 6 cards por linha em telas grandes

  useEffect(() => {
    loadData()
  }, [])

  // Reset para primeira página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [filtroNome, filtroCategoria])

  const loadData = async () => {
    try {
      const [categoriesResult, providersResult] = await Promise.all([getCategories(), getProviders({ active: true })])

      if (categoriesResult.success) {
        setCategories(categoriesResult.data)
      }

      if (providersResult.success) {
        setProviders(providersResult.data)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const prestadoresFiltrados = useMemo(() => {
    return providers?.filter((prestador) => {
      const matchNome =
        prestador.title.toLowerCase().includes(filtroNome.toLowerCase()) ||
        (prestador.subtitle && prestador.subtitle.toLowerCase().includes(filtroNome.toLowerCase()))
      const matchCategoria = filtroCategoria === "all" || prestador.category.name === filtroCategoria
      return matchNome && matchCategoria
    })
  }, [providers, filtroNome, filtroCategoria])

  // Cálculos da paginação
  const totalItems = prestadoresFiltrados?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const prestadoresPaginados = prestadoresFiltrados?.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll suave para o topo da lista
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset para primeira página
  }

  const getCategoriaInfo = (categoryName: string) => {
    // Map category names to colors and icons
    const categoryMap: Record<string, { cor: string; icon: string }> = {
      "Beauty & Aesthetics": { cor: "bg-gradient-to-r from-pink-500 to-rose-500", icon: "✨" },
      "Health & Wellness": { cor: "bg-gradient-to-r from-green-500 to-emerald-500", icon: "🏃‍♂️" },
      Education: { cor: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: "📚" },
      Technology: { cor: "bg-gradient-to-r from-purple-500 to-indigo-500", icon: "💻" },
      Consulting: { cor: "bg-gradient-to-r from-orange-500 to-yellow-500", icon: "💼" },
      Design: { cor: "bg-gradient-to-r from-violet-500 to-purple-500", icon: "🎨" },
      Photography: { cor: "bg-gradient-to-r from-teal-500 to-cyan-500", icon: "📸" },
      Events: { cor: "bg-gradient-to-r from-red-500 to-pink-500", icon: "🎉" },
    }

    return categoryMap[categoryName] || { cor: "bg-gradient-to-r from-gray-500 to-gray-600", icon: "✨" }
  }

  const handleRatingSubmit = async (prestadorId: number, rating: number, comment: string, reviewerName: string) => {
    try {
      const result = await createRating({
        providerId: prestadorId,
        rating,
        comment,
        reviewerName,
      })

      if (result.success) {
        // Reload providers to get updated ratings
        const providersResult = await getProviders({ active: true })
        if (providersResult.success) {
          setProviders(providersResult.data)
        }
      }
    } catch (error) {
      console.error("Error submitting rating:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando prestadores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header com gradiente vibrante */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-col sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="w-340 h-240 flex flex-col sm:flex-row items-center justify-center mb-8">
                <Image src={logoQuemIndicar} alt="Logo Quem Indicar"
                  width={100} height={40} className="mr-2" />                
                  <div className="flex flex-row items-center">
                    <p className="text-5xl text-white font-bold opacity-80">Q</p>
                    <p className="text-3xl text-white font-bold opacity-50">UEM INDICAR</p>
                    <p className="text-5xl text-white font-bold opacity-80">?</p>
                  </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/subscriber-plans">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <RocketIcon className="w-4 h-4 mr-2" />
                  Consulte nossos planos
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtros com design moderno */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Encontre seu profissional ideal
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Buscar por nome</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  placeholder="Digite o nome do prestador..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl transition-all duration-300 hover:shadow-md focus:shadow-lg"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Filtrar por categoria</label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl transition-all duration-300 hover:shadow-md">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="all" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>🌟</span>
                      <span>Todas as categorias</span>
                    </div>
                  </SelectItem>
                  {categories?.map((categoria) => {
                    const categoryInfo = getCategoriaInfo(categoria.name)
                    return (
                      <SelectItem key={categoria.id} value={categoria.name} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <span>{categoryInfo.icon}</span>
                          <span>{categoria.name}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informações dos resultados */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {totalItems === 0
                  ? "Nenhum prestador encontrado"
                  : totalItems === 1
                    ? "1 prestador encontrado"
                    : `${totalItems} prestadores encontrados`}
              </span>
              {totalItems > 0 && (
                <span>
                  Página {currentPage} de {totalPages}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Prestadores com cards menores - até 5 por linha */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {prestadoresPaginados?.map((prestador, index) => {
            const categoriaInfo = getCategoriaInfo(prestador.category.name)
            return (
              <Card
                key={prestador.id}
                className="group overflow-hidden sm:hover:shadow-2xl transition-all duration-500 sm:hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl animate-fade-in hover:animate-pulse-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square relative overflow-hidden rounded-t-2xl">
                  <div
                    className={`absolute inset-0 ${categoriaInfo.cor} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <Image
                    src={prestador.photoUrl || "/placeholder.svg?height=200&width=200"}
                    alt={prestador.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={`${categoriaInfo.cor} text-white border-0 shadow-lg animate-bounce-in text-xs`}>
                      <span className="mr-1">{categoriaInfo.icon}</span>
                      <span className="hidden sm:inline">{prestador.category.name}</span>
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                    <Button onClick={() => {
                      setIsModalOpen(true)
                      setProviderId(prestador.id)
                    }} variant="ghost" size="sm" className="p-0 m-0">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-semibold">{prestador.averageRating.toFixed(1)}</span>
                      <span className="text-xs text-gray-600">({prestador.ratingsCount})</span>                      
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      
                      {/* Título clicável que abre o modal */}
                      <ProviderDetailsModal
                        provider={prestador}
                        categoryInfo={categoriaInfo}
                        onRatingSubmit={handleRatingSubmit}
                      >
                        <CardTitle className="sm:text-sm text-3xl group-hover:text-indigo-600 transition-colors duration-300 truncate cursor-pointer hover:underline">
                          {prestador.title}
                        </CardTitle>
                      </ProviderDetailsModal>                        
                      <CardDescription className="sm:text-xs text-2xl font-medium text-gray-600 truncate">
                        {prestador.subtitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 px-3 pb-3">
                  <p className="sm:text-xs text-1xl  text-gray-600 line-clamp-2 leading-relaxed">{prestador.description}</p>

                  {prestador.address && (
                    <div className="flex items-center gap-1 sm:text-xs text-1xl  text-gray-500">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{prestador.address}</span>
                    </div>
                  )}

                  {/* Contatos com ícones coloridos - versão compacta */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs group/contact hover:bg-green-50 p-1 rounded-lg transition-colors">
                      <div className="w-10 h-10 sm:w-5 sm:h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 sm:w-2.5 sm:h-2.5 text-white" />
                      </div>
                                            
                      <Link href={`https://wa.me/55${prestador.phone.trim().replaceAll(" ","").replaceAll("-","")}?text=Olá gostaria de mais informações sobre seus serviços...`} 
                        target="_blank" 
                        className="text-green-600 hover:underline font-medium truncate text-xl sm:text-sm">
                        <span className="font-medium truncate">{prestador.phone}</span>                        
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 text-xs group/contact hover:bg-blue-50 p-1 rounded-lg transition-colors">
                      <div className="w-10 h-10 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 sm:w-2.5 sm:h-2.5 text-white" />
                      </div>
                      <a
                        href={`mailto:${prestador.email}`}
                        className="text-blue-600 hover:underline font-medium truncate text-xl  sm:text-sm"
                      >
                        {prestador.email}
                      </a>
                    </div>

                    {prestador.website && (
                      <div className="flex items-center gap-2 text-xs group/contact hover:bg-purple-50 p-1 rounded-lg transition-colors">
                        <div className="sm:w-5 sm:h-5 w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Globe className="w-5 h-5 sm:w-2.5 sm:h-2.5 text-white" />
                        </div>
                        <a
                          href={prestador.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline font-medium truncate text-xl sm:text-sm"
                        >
                          Visitar site
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Redes Sociais e Avaliação - versão compacta */}
                  <div className="flex justify-between items-center gap-2 pt-2 border-t border-gray-100">
                    <div className="flex gap-1">
                      {prestador.instagram && (                       
                        <a
                          href={`https://www.instagram.com/${prestador.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline font-medium truncate text-xl  sm:text-sm"
                        >
                          <Instagram className="sm:w-6 sm:h-6 w-10 h-10" />
                        </a>
                      )}
                      {prestador.facebook && (
                        <Button
                          size="sm"
                          className="sm:w-5 sm:h-5 w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 transition-all duration-300 hover:scale-110 shadow-lg p-0"
                        >
                          <Facebook className="sm:w-5 sm:h-5 w-10 h-10" />
                        </Button>
                      )}
                      {prestador.youtube && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 transition-all duration-300 hover:scale-110 shadow-lg h-6 w-6 p-0"
                        >
                          <Youtube className="w-6 h-6" />
                        </Button>
                      )}
                    </div>

                    <RatingModal
                      prestador={{
                        id: prestador.id,
                        titulo: prestador.title,
                        subtitulo: prestador.subtitle || "",
                        foto: prestador.photoUrl || "",
                        categoria: prestador.category.name,
                      }}
                      onRatingSubmit={handleRatingSubmit}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Paginação */}
        {totalItems > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[15, 20, 25, 30, 45, 60]}
            />
          </div>
        )}

        {prestadoresFiltrados?.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xl font-medium">Nenhum prestador encontrado</p>
            <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros de busca</p>
          </div>
        )}        
      </main>
      <ReviewsModal isOpen={isModalOpen} id={providerId}  onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
