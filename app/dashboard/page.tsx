"use client"

import { useState, useEffect } from "react"
import {
  Users,
  TrendingUp,
  Star,
  Eye,
  Plus,
  Filter,
  BarChart3,
  Award,
  Activity,
  ArrowUp,
  ArrowDown,
  LogOut,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { getDashboardStats, getCategoriesStats, getTopProviders, getMonthlyGrowth } from "@/lib/actions/dashboard"

interface DashboardStats {
  totalProviders: number
  totalActiveProviders: number
  totalCategories: number
  totalRatings: number
  averageRating: number
  providersGrowth: number
  ratingsGrowth: number
  accessGrowth: number
  totalAccess: number
}

interface CategoryStats {
  id: number
  nome: string
  count: number
  cor: string
  icon: string
}

interface ProviderStats {
  id: number
  titulo: string
  subtitulo: string
  categoria: string
  foto: string
  acessos: number
  crescimento: number
  rating: number
  totalAvaliacoes: number
  ultimaAvaliacao: string
}

interface MonthlyGrowth {
  providersThisMonth: number
  providersLastMonth: number
  providersGrowth: number
  ratingsThisMonth: number
  ratingsLastMonth: number
  ratingsGrowth: number
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [categoriesStats, setCategoriesStats] = useState<CategoryStats[]>([])
  const [topProviders, setTopProviders] = useState<{
    topByAccess: ProviderStats[]
    topByRating: ProviderStats[]
  }>({ topByAccess: [], topByRating: [] })
  const [monthlyGrowth, setMonthlyGrowth] = useState<MonthlyGrowth | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsResult, categoriesResult, providersResult, growthResult] = await Promise.all([
        getDashboardStats(),
        getCategoriesStats(),
        getTopProviders(),
        getMonthlyGrowth(),
      ])

      if (statsResult.success) {
        setDashboardStats(statsResult.data)
      } else {
        toast({
          title: "Erro",
          description: statsResult.error,
          variant: "destructive",
        })
      }

      if (categoriesResult.success) {
        setCategoriesStats(categoriesResult.data)
      }

      if (providersResult.success) {
        setTopProviders(providersResult.data)
      }

      if (growthResult.success) {
        setMonthlyGrowth(growthResult.data)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
    toast({
      title: "Dados atualizados!",
      description: "Dashboard atualizado com os dados mais recentes.",
    })
  }

  const getCategoriaInfo = (nomeCategoria: string) => {
    return categoriesStats.find((cat) => cat.nome === nomeCategoria) || categoriesStats[0]
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!dashboardStats) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 font-medium">Erro ao carregar dados do dashboard</p>
            <Button onClick={loadDashboardData} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                  <p className="text-white/80 text-sm">Visão geral dos prestadores de serviços</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-white/90 text-sm">
                  <p className="font-medium">Olá, {user?.name}</p>
                  <p className="text-white/70 text-xs">{user?.email}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Atualizar
                  </Button>
                  <Link href="/prestadores">
                    <Button
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Gerenciar Prestadores
                    </Button>
                  </Link>
                  <Link href="/categorias">
                    <Button
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Categorias
                    </Button>
                  </Link>
                  <Link href="/cadastro">
                    <Button
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar Prestador
                    </Button>
                  </Link>
                  <Button
                    onClick={logout}
                    variant="secondary"
                    className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-300/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Cards de Indicadores Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total de Prestadores */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total de Prestadores</CardTitle>
                <Users className="h-6 w-6 text-blue-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardStats.totalProviders}</div>
                <p className="text-xs text-blue-200 mt-1">
                  <span className="inline-flex items-center">
                    {monthlyGrowth && monthlyGrowth.providersGrowth >= 0 ? (
                      <ArrowUp className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDown className="w-3 h-3 mr-1" />
                    )}
                    {monthlyGrowth ? `${Math.abs(monthlyGrowth.providersGrowth)}%` : "0%"} este mês
                  </span>
                </p>
                <p className="text-xs text-blue-300 mt-1">{dashboardStats.totalActiveProviders} ativos</p>
              </CardContent>
            </Card>

            {/* Categoria Mais Popular */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Categoria Mais Popular</CardTitle>
                <TrendingUp className="h-6 w-6 text-green-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {categoriesStats.length > 0
                    ? categoriesStats.reduce((prev, current) => (prev.count > current.count ? prev : current)).nome
                    : "N/A"}
                </div>
                <p className="text-xs text-green-200 mt-1">
                  {categoriesStats.length > 0
                    ? `${categoriesStats.reduce((prev, current) => (prev.count > current.count ? prev : current)).count} prestadores`
                    : "0 prestadores"}
                </p>
              </CardContent>
            </Card>

            {/* Média de Avaliações */}
            <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-100">Média de Avaliações</CardTitle>
                <Star className="h-6 w-6 text-yellow-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardStats.averageRating.toFixed(1)}</div>
                <p className="text-xs text-yellow-200 mt-1">
                  <span className="inline-flex items-center">
                    {monthlyGrowth && monthlyGrowth.ratingsGrowth >= 0 ? (
                      <ArrowUp className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDown className="w-3 h-3 mr-1" />
                    )}
                    {monthlyGrowth ? `${Math.abs(monthlyGrowth.ratingsGrowth)}%` : "0%"} este mês
                  </span>
                </p>
                <p className="text-xs text-yellow-300 mt-1">{dashboardStats.totalRatings} avaliações</p>
              </CardContent>
            </Card>

            {/* Total de Acessos */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Total de Acessos</CardTitle>
                <Activity className="h-6 w-6 text-purple-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(dashboardStats.totalAccess / 1000).toFixed(1)}k</div>
                <p className="text-xs text-purple-200 mt-1">
                  <span className="inline-flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    {dashboardStats.accessGrowth}% este mês
                  </span>
                </p>
                <p className="text-xs text-purple-300 mt-1">Dados simulados</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Prestadores por Categoria */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Prestadores por Categoria
                </CardTitle>
                <CardDescription>Distribuição dos prestadores cadastrados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoriesStats.map((categoria, index) => (
                  <div key={categoria.id} className="space-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 ${categoria.cor} rounded-full flex items-center justify-center text-white text-sm`}
                        >
                          {categoria.icon}
                        </div>
                        <span className="font-medium text-gray-700">{categoria.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-600">{categoria.count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {dashboardStats.totalActiveProviders > 0
                            ? ((categoria.count / dashboardStats.totalActiveProviders) * 100).toFixed(1)
                            : "0"}
                          %
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={
                        dashboardStats.totalActiveProviders > 0
                          ? (categoria.count / dashboardStats.totalActiveProviders) * 100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                ))}
                {categoriesStats.length === 0 && (
                  <div className="text-center py-8 text-gray-500">Nenhuma categoria encontrada</div>
                )}
              </CardContent>
            </Card>

            {/* Ranking dos 10 Prestadores Mais Acessados */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  Top 10 Mais Acessados
                </CardTitle>
                <CardDescription>Prestadores com maior número de visualizações (simulado)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProviders.topByAccess.slice(0, 10).map((prestador, index) => (
                    <div
                      key={prestador.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                          src={prestador.foto || "/placeholder.svg"}
                          alt={prestador.titulo}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{prestador.titulo}</p>
                        <p className="text-xs text-gray-500 truncate">{prestador.subtitulo}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{prestador.acessos.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-1">
                          {prestador.crescimento > 0 ? (
                            <ArrowUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-red-500" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              prestador.crescimento > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {Math.abs(prestador.crescimento)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {topProviders.topByAccess.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhum prestador encontrado</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ranking dos 10 Prestadores com Melhor Rating */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Top 10 Melhor Avaliados
              </CardTitle>
              <CardDescription>Prestadores com as melhores avaliações dos clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topProviders.topByRating.slice(0, 10).map((prestador, index) => {
                  const categoriaInfo = getCategoriaInfo(prestador.categoria)
                  return (
                    <div
                      key={prestador.id}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-yellow-200 hover:bg-yellow-50 transition-all duration-300 hover:shadow-md"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-200">
                        <Image
                          src={prestador.foto || "/placeholder.svg"}
                          alt={prestador.titulo}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{prestador.titulo}</p>
                        <p className="text-sm text-gray-600 truncate">{prestador.subtitulo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {categoriaInfo && (
                            <Badge className={`${categoriaInfo.cor} text-white border-0 text-xs`}>
                              {prestador.categoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-bold text-lg text-gray-900">{prestador.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{prestador.totalAvaliacoes} avaliações</p>
                        <p className="text-xs text-gray-400">há {prestador.ultimaAvaliacao}</p>
                      </div>
                    </div>
                  )
                })}
                {topProviders.topByRating.length === 0 && (
                  <div className="text-center py-8 text-gray-500 col-span-2">
                    Nenhum prestador com avaliações encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
