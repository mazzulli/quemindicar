import { Button } from "@/components/ui/button";
import Header from "./components/header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckIcon } from "lucide-react";
import ContractButton from "./components/contract-button";


interface SubscriptionsProps {
    product: {
        priceId: string;
        amount: number;
    };
}

export default function Subscriptions( {product}: SubscriptionsProps ){
  return (
    <>
      {/* Header igual ao app/page.tsx */}
      <Header
        title="Planos de Assinatura"
        description="Escolha o plano ideal para manter sua publicidade ativa."
      />

      {/* Centralizar os cards */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-6">
          {/* PLANO MENSAL */}
          <Card className="w-[450px]">
            <CardHeader className="border-b border-solid py-8">
              <h2 className="text-center text-2xl font-semibold">
                Plano Mensal
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-6xl font-semibold">29,90</span>
                <span className="text-2xl text-muted-foreground">/mês</span>
              </div>
              <div>
                <Separator className="my-4" />
                <p>Total anual: R$358,80</p>
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
                    <ContractButton />
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
                <span className="text-6xl font-semibold">161,40</span>
                <span className="text-2xl text-muted-foreground">/semestral</span>
              </div>
              <div>
                <Separator className="my-4" />
                <p>Total anual: R$322,80</p>
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
                <p>Renovação automáica</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="w-full mt-10">
                    <ContractButton />
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
                <span className="text-6xl font-semibold">251,10</span>
                <span className="text-2xl text-muted-foreground">/anual</span>
              </div>
              <div>
                <Separator className="my-4" />
                <p>Total anual: R$251,10</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 py-4 h-[200px]">
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Desconto de 30%</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Sua publicidade ativa por 1 ano</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon className="text-primary" />
                <p>Renovação automáica</p>
              </div>              
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="w-full mt-10">                 
                  <ContractButton />
                </div>
            </CardFooter>
          </Card>
        </div>
      </div>

    </>
  );
};

