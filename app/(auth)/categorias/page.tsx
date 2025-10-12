"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Filter, Router } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface Category {
  id: number
  name: string
  providersCount: number
  createdAt: Date
  updatedAt: Date
}

export default function CategoriasPage() {
  const { data: session, status} = useSession()
  const router = useRouter()

  if (session?.user?.role !== "Administrator" || session?.user === undefined) {
    router.push("/")
  }

  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[] | undefined>([])
  const [loading, setLoading] = useState(true)
  const [novaCategoria, setNovaCategoria] = useState("")
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [nomeEditando, setNomeEditando] = useState("")
  const [submitting, setSubmitting] = useState(false)
  
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
          title: "Erro",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const adicionarCategoria = async () => {
    if (!novaCategoria.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite o nome da categoria.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const result = await createCategory({ name: novaCategoria.trim() })

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        setNovaCategoria("")
        await loadCategories()
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
        description: "Erro ao criar categoria",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const iniciarEdicao = (categoria: Category) => {
    setEditandoId(categoria.id)
    setNomeEditando(categoria.name)
  }

  const salvarEdicao = async () => {
    if (!nomeEditando.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite o nome da categoria.",
        variant: "destructive",
      })
      return
    }

    if (!editandoId) return

    setSubmitting(true)
    try {
      const result = await updateCategory({
        id: editandoId,
        name: nomeEditando.trim(),
      })

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        setEditandoId(null)
        setNomeEditando("")
        await loadCategories()
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
        description: "Erro ao atualizar categoria",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setNomeEditando("")
  }

  const excluirCategoria = async (id: number) => {
    setSubmitting(true)
    try {
      const result = await deleteCategory(id)

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
        await loadCategories()
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
        description: "Erro ao excluir categoria",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando categorias...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-around gap-4">              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Filter className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Gerenciar Categorias</h1>
                  <p className="text-white/80 text-sm">Organize as categorias de serviços</p>
                </div>
              </div>
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
        </header>

        <main className="container mx-auto px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Adicionar Nova Categoria */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle>Adicionar Nova Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="nova-categoria" className="sr-only">
                      Nome da categoria
                    </Label>
                    <Input
                      id="nova-categoria"
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      placeholder="Digite o nome da nova categoria..."
                      onKeyPress={(e) => e.key === "Enter" && !submitting && adicionarCategoria()}
                      disabled={submitting}
                    />
                  </div>
                  <Button
                    onClick={adicionarCategoria}
                    disabled={submitting}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Categorias */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
              <CardHeader>
                <CardTitle>Categorias Cadastradas ({categories?.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories?.map((categoria) => (
                    <div
                      key={categoria.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-indigo-300 transition-all duration-300 hover:shadow-md"
                    >
                      {editandoId === categoria.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={nomeEditando}
                            onChange={(e) => setNomeEditando(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && !submitting && salvarEdicao()}
                            className="flex-1"
                            disabled={submitting}
                          />
                          <Button size="sm" onClick={salvarEdicao} disabled={submitting}>
                            {submitting ? (
                              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelarEdicao} disabled={submitting}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="font-medium">{categoria.name}</span>
                            <p className="text-sm text-gray-500">
                              {categoria.providersCount} prestador{categoria.providersCount !== 1 ? "es" : ""}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => iniciarEdicao(categoria)}
                              disabled={submitting}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" disabled={submitting}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a categoria "{categoria.name}"?
                                    {categoria.providersCount > 0 && (
                                      <span className="text-red-600 font-medium">
                                        {" "}
                                        Esta categoria possui {categoria.providersCount} prestador
                                        {categoria.providersCount !== 1 ? "es" : ""} vinculado
                                        {categoria.providersCount !== 1 ? "s" : ""}.
                                      </span>
                                    )}{" "}
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => excluirCategoria(categoria.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {categories?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhuma categoria cadastrada ainda.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  )
}
