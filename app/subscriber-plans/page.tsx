import Header from "./components/header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookMarkedIcon, CheckIcon, FileCode2Icon, TicketXIcon } from "lucide-react";
import CheckoutButton from "../_components/checkout-button";
import Link from "next/link";

export default function Subscriptions( ){
  const monthlyPrice = process.env.STRIPE_MONTHLY_PRICE_ID!
  const semestralPrice = process.env.STRIPE_SEMESTRAL_PRICE_ID!
  const anualPrice = process.env.STRIPE_ANUAL_PRICE_ID!
  
  return (
    <>
      {/* Header igual ao app/page.tsx */}
      <Header
        title="Planos de Assinatura"
        description="Escolha o plano ideal para manter sua publicidade ativa."
        path="/"
      />

      {/* Centralizar os cards */}
      <div className="flex justify-center mt-8 flex-col">
        <div className="flex gap-6  flex-col sm:flex-row items-center justify-center mt-12">
          {/* PLANO MENSAL */}
          <Card className="w-[450px]">
            <CardHeader className="border-b border-solid py-8">
              <h2 className="text-center text-2xl font-semibold">
                Plano Mensal
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-6xl font-semibold">19,90</span>
                <span className="text-2xl text-muted-foreground">/mês</span>
              </div>
              <div>
                <Separator className="my-4" />
                <p>Total anual: R$238,80</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 py-4 h-[200px]">
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>
                  Mantenha sua publicidade ativa por 30 dias                                   
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>
                  Renovação automática                                   
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="w-full mt-10">
                    <CheckoutButton priceId={monthlyPrice}>Assinar</CheckoutButton>
                </div>
            </CardFooter>
          </Card>

          {/* PLANO SEMESTRAL */}
          <Card className="w-[450px]">
            <CardHeader className="relative border-b border-solid py-8">              
              <h2 className="text-center text-2xl font-semibold">
                Plano Semestral
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-6xl font-semibold">107,46</span>
                <span className="text-2xl text-muted-foreground">/semestral</span>
              </div>
              <div>
                <Separator className="my-4" />
                <p>Total anual: R$214,92</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 py-4 h-[200px]">
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Desconto de 10%</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Sua publicidade ativa por 6 meses</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Renovação automática</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="w-full mt-10">
                    <CheckoutButton priceId={semestralPrice}>Assinar</CheckoutButton>
                </div>
            </CardFooter>
          </Card>

          {/* PLANO ANUAL */}
          <Card className="w-[450px]">
            <CardHeader className="relative border-b border-solid py-8">              
              <h2 className="text-center text-2xl font-semibold">
                Plano Anual
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-6xl font-semibold">202,98</span>
                <span className="text-2xl text-muted-foreground">/anual</span>
              </div>
              <div>
                <Separator className="my-4" />
                <p>Total anual: R$202,98</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 py-4 h-[200px]">
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Desconto de 15%</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Sua publicidade ativa por 1 ano</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Renovação automática</p>
              </div>              
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="w-full mt-10 flex justify-center items-center">                 
                  <CheckoutButton priceId={anualPrice}>Assinar</CheckoutButton>
                </div>
            </CardFooter>
          </Card>
        </div>
        <Separator className="mt-12 mb-10" />
        <div className="flex sm:justify-end justify-between sm:p-6 p-4 text-xs sm:text-sm gap-8">
          <Link href='/terms-of-use' className="flex items-center gap-2 text-center flex-col sm:flex-row">
            <FileCode2Icon  width={20} height={20} />
            Termos de Uso
          </Link>
          <Link href='/privacy-policy' className="flex items-center gap-2 text-center flex-col sm:flex-row">
            <BookMarkedIcon  width={20} height={20} />
            Política de Privacidade
          </Link>
          <Link href='/refund-policy' className="flex items-center gap-2 text-center flex-col sm:flex-row">
            <TicketXIcon width={20} height={20} />            
            Política de Reembolso <br />
            e Cancelamento
          </Link>
        </div>        
      </div>
    </>
  );
};

