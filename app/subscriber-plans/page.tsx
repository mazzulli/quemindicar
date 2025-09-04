import Header from "./components/header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookMarkedIcon, CheckIcon, FileCode2Icon, GlobeIcon, GroupIcon, Mail, PhoneCall, PhoneIcon, Target, TicketXIcon, TrendingUp, Users, UsersRoundIcon } from "lucide-react";
import CheckoutButton from "./components/checkout-button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Acelere o Crescimento do Seu Negócio
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Junte-se a diversos profissionais que já aumentaram suas vendas em até 300% com nossa plataforma de divulgação
          </p>          
          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-accent/20 bg-card/50">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-12 h-12 text-pink-700" />
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-2">+300%</div>
                <div className="text-sm text-muted-foreground">Aumento médio em vendas</div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20 bg-card/50">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-12 h-12 text-pink-700" />
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-2">2M+</div>
                <div className="text-sm text-muted-foreground">Clientes alcançados mensalmente</div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20 bg-card/50">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Target className="w-12 h-12 text-pink-700" />
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Taxa de conversão média</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Centralizar os cards */}
      <div className="flex justify-center mt-8 flex-col">      
        <div className="flex gap-6 flex-col sm:flex-row items-center justify-center mt-12">
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
          <Card className="w-[450px] border-primary border-2 sm:mt-[-60px] mt-4">
            <CardHeader className="relative border-b border-solid py-8">              
              <Badge className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-xl">Mais Popular</Badge>
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
        
        {/* BANNER SITE */}
        <div className="container mx-auto px-4 text-center mt-24 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Quer impulsionar ainda mais e aproveitar para tirar seu negócio do anonimato?
          </h1>
          <p className="text-xl text-muted-foreground">
            Solicite agora mesmo a construção do seu site
          </p>  
        </div>

        {/* VIDEO */}
        <div className="container text-center flex flex-col justify-center items-center px-4">
          <video 
            preload="metadata" 
            poster="/imageFiles/site499.png" 
            className="flex justify-center items-center rounded-xl mb-12" autoPlay loop>          
            <source src="/imageFiles/site499.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
          </video>
          <div className="flex sm:flex-row flex-col items-center justify-center gap-12 text-sm">
            <Link href="https://www.ssitconsulting.com.br" target="_blank" className="flex flex-col items-center">
              <GlobeIcon className="w-8 h-8 text-pink-700 mx-auto" />
              <p>www.ssitconsulting.com.br</p>
            </Link>            
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-pink-700 mx-auto" />
              <p>contato@ssitconsulting.com.br</p>
            </div>            
            <Link href="https://wa.me/+5511992281207?text=Olá! Vi seu anúncio no www.quemindicar.com.br e gostaria de mais informações sobre a criação de site por R$ 499,00..." target="_blank" className="flex flex-col items-center">
              <PhoneCall className="w-8 h-8 text-pink-700 mx-auto" />
              <p>+55 11 99228-1207</p>
            </Link>            
          </div>
        </div>

        {/* FOOTER */}
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

