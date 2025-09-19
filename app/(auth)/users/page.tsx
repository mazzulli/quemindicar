"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useEffect, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import Link from "next/link"
import { User } from "@prisma/client"
import { deleteUser, getUsers, toggleUserStatus } from "@/lib/actions/users"
import { ArrowLeft, Edit, Eye, EyeOff, Filter, Hash, Plus, Search, Trash2, Users  } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import PasswordRessend from "./components/password-ressend"
import { useRouter } from "next/navigation"

const UsersPage = () => {
    const { user } = useAuth()
    const router = useRouter()

    if (user?.role !== "Administrator") {
        router.push("/dashboard")        
    }

    const { toast } = useToast()    
    const [users, setUsers] = useState<User[] | undefined>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")  

    useEffect(() => {
        loadData()
    }, [user?.email])

    const loadData = async () => {
        try {
            const usersResult =  await getUsers()
            
            if (usersResult.success) {
                setUsers(usersResult.data)
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

    const filteredAndSortedUsers = useMemo(() => {            
        const filtered = users?.filter((user) => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) 
            return matchesSearch
        })
        return filtered
    }, [users, searchTerm])

    const handleToggleStatus = async (id: string) => {
        setSubmitting(true)
        try {
          const result = await toggleUserStatus(id)
    
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

    const handleDelete = async (id: string) => {
        setSubmitting(true)
        try {
          const result = await deleteUser(id)
    
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
            description: "Erro ao excluir usuário",
            variant: "destructive",
          })
        } finally {
          setSubmitting(false)
        }
    }

    const handleResendPassword = async (id: string, email: string, name: string) => {
        setSubmitting(true)
        try {
            const resend = await PasswordRessend(id, email, name)
            if (resend && !resend.error) {
                toast({
                    title: "Sucesso!",
                    description: "Senha reenviada com sucesso!",
                })
            } else {
                toast({
                    title: "Erro",
                    description: resend?.error || "Erro ao reenviar senha",
                    variant: "destructive",
                })
            }
        } catch (error) {

            console.log("Error resend password: ", error)
          toast({
            title: "Erro",
            description: "Erro ao reenviar senha",
            variant: "destructive",
          })
        }
    }


    if (loading) {
        return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Carregando usuários...</p>
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
            <div className="flex items-center justify-between flex-col sm:flex-row md:flex-row gap-4">
                <div className="flex items-center gap-4 justify-around">                
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>                    
                    </div>
                </div>                
                </div>
                <div className="flex items-center justify-end gap-4">
                <Link href="/newuser">
                    <Button
                    variant="secondary"
                    className="bg-green-500/20 hover:bg-green-500/30 text-white border-green-300/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Usuário
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
                        Buscar
                    </CardTitle>                
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
                                placeholder="Nome do usuário..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
            </Card>

            {/* Lista de Usuários */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-2xl animate-fade-in">
                <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow className="border-b-2 border-gray-100">
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>                        
                        <TableHead>Tipo de Acesso</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-32">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedUsers?.map((user) => {
                        return (
                            <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell>
                                    <span className="text-sm text-gray-500">{user.name}</span>                                
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-500">{user.email}</span>                                
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-500">{user.role === "Administrator" ? "Administrador" : "Cliente"}</span>                                
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.active ? "default" : "secondary"}>
                                    {user.active ? "Ativo" : "Inativo"}
                                </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggleStatus(user.id)}
                                            disabled={submitting}
                                            title={user.active ? "Desativar" : "Ativar"}
                                        >
                                            {user.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                        <Link href={`/users/edit/${user.id}`}>
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
                                                Tem certeza que deseja excluir o usuário "{user.name}"? Esta ação não
                                                pode ser desfeita e todas as avaliações serão perdidas.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                    onClick={() => handleDelete(user.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Excluir
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>  

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="outline" disabled={submitting} title="Reset senha">
                                                    <Hash className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirmar Reenvio de Senha</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                Esta ação irá gerar uma nova senha e enviá-la ao cliente. 
                                                Tem certeza que deseja ressetar a senha do usuário "{user.name}"?                                                 
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                    onClick={() => handleResendPassword(user.id, user.email, user.name)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Reenviar
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

            {filteredAndSortedUsers?.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl font-medium">Nenhum usuário encontrado</p>
                <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros de busca</p>
            </div>
            )}
        </main>
        </div>
    </ProtectedRoute>
    )
}
 
export default UsersPage;