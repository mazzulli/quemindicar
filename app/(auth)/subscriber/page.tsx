import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Pause, X, Search } from "lucide-react"

export default function SubscriberPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-12 p-6 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight">Gerenciador de Assinaturas</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            Gerencie todas as suas subscrições do Quem Indicar em um só lugar. Visualize, pause ou cancele suas subscrições de
            forma simples e rápida.
          </p>
          <div className="pt-4">
            <Button asChild size="lg">
              <Link href="/subscriptions">
                <Search className="mr-2 h-5 w-5" />
                Buscar Minhas Subscrições
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Buscar Subscrições</CardTitle>
              <CardDescription>Encontre todas as subscrições vinculadas ao seu email</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Digite seu email e visualize todas as suas subscrições ativas, pausadas ou canceladas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Pause className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Pausar Subscrições</CardTitle>
              <CardDescription>Pause temporariamente suas subscrições</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Precisa de uma pausa? Suspenda suas subscrições e retome quando quiser.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <X className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Cancelar Subscrições</CardTitle>
              <CardDescription>Cancele subscrições que não precisa mais</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cancele suas subscrições de forma simples e direta, sem complicações.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Integração com Stripe
            </CardTitle>
            <CardDescription>Este aplicativo está conectado ao Stripe para gerenciar suas subscrições</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Todas as operações são realizadas de forma segura através da API do Stripe. Suas informações de pagamento
              permanecem protegidas e nunca são armazenadas neste aplicativo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
