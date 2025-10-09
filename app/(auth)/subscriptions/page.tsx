"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, Pause, Play, X, CreditCard } from "lucide-react"
import Stripe from "stripe";

export default function SubscriptionsPage() {
  const [email, setEmail] = useState("")
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSubscriptions = async () => {
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um email para buscar as subscrições.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    alert("Email: " + encodeURIComponent(email))
    try {
      //const response = await fetch(`/api/subscriptions?email=${encodeURIComponent(email)}`)
      console.log("STRIPE INSTANCE: ", process.env.STRIPE_SECRET_KEY)
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",});

      console.log("STRIPE INSTANCE: ", stripe)

      const session = await stripe.checkout.sessions.retrieve('cs_test_a1Jp0gG4b5gWv1Y2Z3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y', {
        expand: ['line_items'],
      });

      // const response = await stripe.subscriptions.list({
      //   limit: 10,
      //   expand: ['data.default_payment_method'],
      // });
      
      console.log("SUBSCRIPTIONS: ", session)

      const data = session

      // if (!response) {
      //   throw new Error(data.error || "Erro ao buscar subscrições")
      // }

      // setSubscriptions(data.subscriptions)

      // if (data.subscriptions.length === 0) {
      //   toast({
      //     title: "Nenhuma subscrição encontrada",
      //     description: "Não foram encontradas subscrições para este email.",
      //   })
      // } else {
      //   toast({
      //     title: "Subscrições carregadas",
      //     description: `${data.subscriptions.length} subscrição(ões) encontrada(s).`,
      //   })
      // }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao buscar subscrições",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePause = async (subscriptionId: string) => {
    setActionLoading(subscriptionId)
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/pause`, {
        method: "POST",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao pausar subscrição")
      }

      // Atualizar a lista de subscrições
      setSubscriptions((prev) => prev.map((sub) => (sub.id === subscriptionId ? data.subscription : sub)))

      toast({
        title: "Subscrição pausada",
        description: "A subscrição foi pausada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao pausar subscrição",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleResume = async (subscriptionId: string) => {
    setActionLoading(subscriptionId)
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/resume`, {
        method: "POST",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao retomar subscrição")
      }

      // Atualizar a lista de subscrições
      setSubscriptions((prev) => prev.map((sub) => (sub.id === subscriptionId ? data.subscription : sub)))

      toast({
        title: "Subscrição retomada",
        description: "A subscrição foi retomada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao retomar subscrição",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta subscrição? Esta ação não pode ser desfeita.")) {
      return
    }

    setActionLoading(subscriptionId)
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cancelar subscrição")
      }

      // Atualizar a lista de subscrições
      setSubscriptions((prev) => prev.map((sub) => (sub.id === subscriptionId ? data.subscription : sub)))

      toast({
        title: "Subscrição cancelada",
        description: "A subscrição foi cancelada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cancelar subscrição",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: "Ativa", variant: "default" },
      paused: { label: "Pausada", variant: "secondary" },
      canceled: { label: "Cancelada", variant: "destructive" },
      incomplete: { label: "Incompleta", variant: "outline" },
      incomplete_expired: { label: "Expirada", variant: "destructive" },
      trialing: { label: "Período de teste", variant: "outline" },
      past_due: { label: "Vencida", variant: "destructive" },
      unpaid: { label: "Não paga", variant: "destructive" },
    }

    const config = statusMap[status] || { label: status, variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Gerenciar Subscrições</h1>
          <p className="text-muted-foreground">Visualize e gerencie todas as suas subscrições do Stripe</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Subscrições</CardTitle>
            <CardDescription>Insira seu email para visualizar todas as subscrições vinculadas</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                fetchSubscriptions()
              }}
              className="flex gap-4"
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {subscriptions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Suas Subscrições ({subscriptions.length})</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {subscriptions.map((subscription) => {
                const isPaused = subscription.pause_collection !== null
                const isCanceled = subscription.status === "canceled"
                const isActive = subscription.status === "active" && !isPaused

                return (
                  <Card key={subscription.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Subscrição
                          </CardTitle>
                          <CardDescription className="font-mono text-xs">{subscription.id}</CardDescription>
                        </div>
                        {getStatusBadge(isPaused ? "paused" : subscription.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Valor:</span>
                          <span className="font-semibold">
                            {formatCurrency(subscription.items.data[0]?.price.unit_amount || 0, subscription.currency)}
                            {subscription.items.data[0]?.price.recurring?.interval && (
                              <span className="text-muted-foreground">
                                /{subscription.items.data[0].price.recurring.interval === "month" ? "mês" : "ano"}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Início:</span>
                          <span>{formatDate(subscription.created)}</span>
                        </div>
                        {subscription.current_period_end && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {isCanceled ? "Cancelada em:" : "Próxima cobrança:"}
                            </span>
                            <span>{formatDate(subscription.current_period_end)}</span>
                          </div>
                        )}
                      </div>

                      {!isCanceled && (
                        <div className="flex gap-2">
                          {isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePause(subscription.id)}
                              disabled={actionLoading === subscription.id}
                              className="flex-1"
                            >
                              {actionLoading === subscription.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Pause className="mr-2 h-4 w-4" />
                              )}
                              Pausar
                            </Button>
                          )}
                          {isPaused && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResume(subscription.id)}
                              disabled={actionLoading === subscription.id}
                              className="flex-1"
                            >
                              {actionLoading === subscription.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="mr-2 h-4 w-4" />
                              )}
                              Retomar
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(subscription.id)}
                            disabled={actionLoading === subscription.id}
                            className="flex-1"
                          >
                            {actionLoading === subscription.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <X className="mr-2 h-4 w-4" />
                            )}
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
