import Header from "@/app/subscriber-plans/components/header";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, MailCheck } from "lucide-react";

const RefundPolicy = () => {    
    return ( 
        <>
            <Header
                title="Política de Reembolso e Cancelamento"
                description="Leia atentamento nossa política."
                path="/subscriber-plans"
            />
        
            <div className="p-4 sm:p-10 mt-8">
                <h1><b>POLÍTICA DE REEMBOLSO E CANCELAMENTO – QUEMINDICAR.COM.BR</b></h1>
                <h2><strong>Última atualização:</strong> [01/08/2025]</h2>
                
                <Separator className="mt-8 mb-8"/>
                
                <div className="py-6">
                    <b>1. Objeto e Âmbito de Aplicação</b>
                    <p>A presente Política de Reembolso e Cancelamento estabelece as condições 
                        sob as quais um cliente da plataforma <strong>[QUEMINDICAR.COM.BR]</strong> 
                        poderá solicitar o reembolso dos valores pagos pela assinatura de serviços 
                        de divulgação. Esta política aplica-se a todos os planos de assinatura 
                        contratados (mensal, semestral ou anual) e é regida pelas leis brasileiras 
                        vigentes, em especial o Código de Defesa do Consumidor (Lei nº 8.078/1990).
                    </p>
                    
                    <Separator className="mt-8 mb-8"/>

                    <b>2. Direito de Arrependimento e Prazo para Solicitação</b>
                    <p>De acordo com o <strong>Código de Defesa do Consumidor</strong>, o cliente tem o 
                    direito de arrependimento e pode solicitar o reembolso integral do valor pago em 
                    até <strong>7 (sete) dias corridos</strong> a partir da data de confirmação do 
                    pagamento e início do serviço.</p>
                    <p>Esta solicitação é válida caso o cliente não esteja satisfeito com o serviço 
                        de divulgação oferecido pela plataforma.</p>

                    <Separator className="mt-8 mb-8"/>

                    <b>3. Procedimento de Solicitação</b>
                    <p>Para solicitar o cancelamento e o reembolso, o cliente deverá enviar 
                        um e-mail para <strong>contato@quemindicar.com.br</strong>, informando os seguintes 
                        dados:
                    </p>
                    <ul className="mt-4 mb-4">
                        <li className="flex"><CheckIcon /><strong>Nome completo ou Razão Social do Cliente</strong></li>
                        <li className="flex"><CheckIcon /><strong>CPF ou CNPJ</strong></li>
                        <li className="flex"><CheckIcon /><strong>Número da fatura ou comprovante de pagamento</strong></li>
                        <li className="flex"><CheckIcon /><strong>Data da contratação do serviço</strong></li>
                        <li className="flex"><CheckIcon /><strong>Motivo da insatisfação</strong></li>
                    </ul>
                    <p>A solicitação de cancelamento será formalizada e considerada válida somente após o 
                        recebimento do e-mail com todas as informações necessárias. 
                        A equipe de atendimento da plataforma <strong>[QUEMINDICAR.COM.BR]</strong> confirmará 
                        o recebimento da solicitação em até 3 (três) dias úteis.</p>

                    <Separator className="mt-8 mb-8"/>

                    <b>4. Prazo para Efetivação do Reembolso</b>
                    <p>Após a solicitação de cancelamento ser validada, o reembolso será processado e 
                        efetuado em até <strong>30 (trinta) dias corridos</strong>. O valor será 
                        devolvido utilizando o mesmo método de pagamento utilizado na compra, 
                        sempre que possível.</p>

                    <Separator className="mt-8 mb-8"/>

                    <b>5. Exclusões e Considerações Finais</b>
                    <ul className="mt-4 mb-4">
                        <li className="flex"><CheckIcon /> Após o período de 7 (sete) dias corridos a partir da contratação, não será mais possível solicitar o reembolso dos valores pagos. Nesses casos, o cliente poderá solicitar o cancelamento da renovação automática, caso se aplique, e o serviço permanecerá ativo até o final do período contratado.</li>
                        <li className="flex"><CheckIcon /> Em caso de identificação de uso indevido da plataforma ou de violação dos termos de uso, o direito ao reembolso poderá ser invalidado, sem prejuízo de outras medidas legais cabíveis.</li>
                        <li className="flex"><CheckIcon /> O cliente reconhece e concorda que a efetivação do reembolso está sujeita aos prazos e procedimentos bancários e/ou das operadoras de cartão de crédito.</li>
                    </ul>
                    <p>Ao contratar os serviços da plataforma <strong>[QUEMINDICAR.COM.BR]</strong>, o 
                    cliente declara ter lido, compreendido e concordado com os termos desta 
                    Política de Reembolso e Cancelamento.</p>            

                    <Separator className="mt-8 mb-8"/>

                    <b>6. CONTATO</b>
                    <p>Dúvidas ou solicitações poderão ser encaminhadas para:</p>
                    <p className="flex items-center gap-4"><MailCheck /><strong>E-mail: [contato@quemindicar.com.br]</strong></p>        
                </div>
            </div>
        </>
     );
}
 
export default RefundPolicy;