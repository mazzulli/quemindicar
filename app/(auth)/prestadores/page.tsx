"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  EyeOff,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { getCategories } from "@/lib/actions/categories"
import { getProviders, deleteProvider, toggleProviderStatus } from "@/lib/actions/providers"

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
  createdAt: Date
  updatedAt: Date
  averageRating: number
  ratingsCount: number
}

type SortField = "title" | "category" | "rating" | "createdAt"
type SortOrder = "asc" | "desc"

export default function PrestadoresPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[] | undefined>([])
  const [providers, setProviders] = useState<Provider[] | undefined>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Ordenação
  const [sortField, setSortField] = useState<SortField>("title")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  // View mode
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesResult, providersResult] = await Promise.all([getCategories(), getProviders()])

      if (categoriesResult.success) {
        setCategories(categoriesResult.data)
      }

      if (providersResult.success) {
        setProviders(providersResult.data)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProviders = useMemo(() => {
    const filtered = providers?.filter((provider) => {
      const matchesSearch =
        provider.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (provider.subtitle && provider.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (provider.description && provider.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || provider.category.id.toString() === selectedCategory

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && provider.active) ||
        (statusFilter === "inactive" && !provider.active)

      return matchesSearch && matchesCategory && matchesStatus
    })

    // Ordenação
    filtered?.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "category":
          aValue = a.category.name.toLowerCase()
          bValue = b.category.name.toLowerCase()
          break
        case "rating":
          aValue = a.averageRating
          bValue = b.averageRating
          break
        case "createdAt":
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [providers, searchTerm, selectedCategory, statusFilter, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleDelete = async (id: number) => {
    setSubmitting(true)
    try {
      const result = await deleteProvider(id)

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        await loadData()
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
        description: "Erro ao excluir prestador",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (id: number) => {
    setSubmitting(true)
    try {
      const result = await toggleProviderStatus(id)

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        await loadData()
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
        description: "Erro ao alterar status",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getCategoryInfo = (categoryName: string) => {
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

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-semibold hover:bg-gray-100"
    >
      <span className="flex items-center gap-1">
        {children}
        {sortField === field ? (
          sortOrder === "asc" ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-50" />
        )}
      </span>
    </Button>
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando prestadores...</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 justify-around">                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Gerenciar Prestadores</h1>
                    <p className="text-white/80 text-sm">
                      {filteredAndSortedProviders?.length} de {providers?.length} prestadores
                    </p>
                  </div>
                </div>                
              </div>
              <div className="flex items-center justify-end gap-4">
                <Link href="/cadastro">
                  <Button
                    variant="secondary"
                    className="bg-green-500/20 hover:bg-green-500/30 text-white border-green-300/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Prestador
                  </Button>
                </Link>
                <Link href="/dashboard">
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
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
          {/* Filtros e Controles */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl mb-8 animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-indigo-600" />
                  Filtros e Ordenação
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    Tabela
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                  >
                    Cards
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Busca por nome */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Buscar por nome</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Nome do prestador..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtro por categoria */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por status */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ordenação */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Ordenar por</Label>
                  <Select
                    value={`${sortField}-${sortOrder}`}
                    onValueChange={(value) => {
                      const [field, order] = value.split("-") as [SortField, SortOrder]
                      setSortField(field)
                      setSortOrder(order)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title-asc">Nome (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Nome (Z-A)</SelectItem>
                      <SelectItem value="category-asc">Categoria (A-Z)</SelectItem>
                      <SelectItem value="category-desc">Categoria (Z-A)</SelectItem>
                      <SelectItem value="rating-desc">Melhor Avaliado</SelectItem>
                      <SelectItem value="rating-asc">Pior Avaliado</SelectItem>
                      <SelectItem value="createdAt-desc">Mais Recente</SelectItem>
                      <SelectItem value="createdAt-asc">Mais Antigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Prestadores */}
          {viewMode === "table" ? (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-2 border-gray-100">
                        <TableHead className="w-16">Foto</TableHead>
                        <TableHead>
                          <SortButton field="title">Nome</SortButton>
                        </TableHead>
                        <TableHead>
                          <SortButton field="category">Categoria</SortButton>
                        </TableHead>
                        <TableHead>
                          <SortButton field="rating">Avaliação</SortButton>
                        </TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-32">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedProviders?.map((provider) => {
                        const categoryInfo = getCategoryInfo(provider.category.name)
                        return (
                          <TableRow key={provider.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                                <Image
                                  src={provider.photoUrl || "/placeholder.svg?height=48&width=48"}
                                  alt={provider.title}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-semibold text-gray-900">{provider.title}</p>
                                {provider.subtitle && <p className="text-sm text-gray-600">{provider.subtitle}</p>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${categoryInfo.cor} text-white border-0`}>
                                <span className="mr-1">{categoryInfo.icon}</span>
                                {provider.category.name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-semibold">{provider.averageRating.toFixed(1)}</span>
                                <span className="text-sm text-gray-500">({provider.ratingsCount})</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm">{provider.phone}</p>
                                <p className="text-sm text-gray-600">{provider.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={provider.active ? "default" : "secondary"}>
                                {provider.active ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleStatus(provider.id)}
                                  disabled={submitting}
                                  title={provider.active ? "Desativar" : "Ativar"}
                                >
                                  {provider.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Link href={`/prestadores/editar/${provider.id}`}>
                                  <Button size="sm" variant="outline" title="Editar">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="outline" disabled={submitting} title="Excluir">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir o prestador "{provider.title}"? Esta ação não
                                        pode ser desfeita e todas as avaliações serão perdidas.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(provider.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* View em Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProviders?.map((provider, index) => {
                const categoryInfo = getCategoryInfo(provider.category.name)
                return (
                  <Card
                    key={provider.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-square relative overflow-hidden rounded-t-2xl">
                      <div
                        className={`absolute inset-0 ${categoryInfo.cor} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                      />
                      <Image
                        src={provider.photoUrl || "/placeholder.svg?height=200&width=200"}
                        alt={provider.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={`${categoryInfo.cor} text-white border-0 shadow-lg`}>
                          <span className="mr-1">{categoryInfo.icon}</span>
                          {provider.category.name}
                        </Badge>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge variant={provider.active ? "default" : "secondary"} className="shadow-lg">
                          {provider.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{provider.averageRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-600">({provider.ratingsCount})</span>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors duration-300">
                        {provider.title}
                      </CardTitle>
                      {provider.subtitle && <p className="text-sm font-medium text-gray-600">{provider.subtitle}</p>}
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{provider.phone}</p>
                        <p className="text-sm text-gray-600">{provider.email}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(provider.id)}
                            disabled={submitting}
                            title={provider.active ? "Desativar" : "Ativar"}
                          >
                            {provider.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Link href={`/prestadores/editar/${provider.id}`}>
                            <Button size="sm" variant="outline" title="Editar">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" disabled={submitting}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o prestador "{provider.title}"? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(provider.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {filteredAndSortedProviders?.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xl font-medium">Nenhum prestador encontrado</p>
              <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
