'use client'

import Link from "next/link";
import SendMailButton from "./send-mail-button";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from 'next/image'
import successImage from '@/public/handshake.jpg'

type ConfirmationPageProps = {
    customerName: string;
    customerEmail: string;
    initialPassword: string;
    isSuccess: boolean;
};  

const ConfirmationPage = ({customerName, customerEmail, initialPassword, isSuccess}: ConfirmationPageProps) => {
    const [ sentEmail, setSentEmail] = useState<boolean>(false);

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-background relative">
                {/* Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-2xl">
                    {/* Main Success Card */}
                    <Card className="p-8 md:p-12 text-center shadow-elegant border-success-border/20 bg-card/95 backdrop-blur-sm animate-fade-in">
                        <div className="space-y-8">
                            {/* Success Icon */}
                            <div className="flex justify-center">
                                <Image  src={successImage}       
                                alt="Imagem de agradecimento"                        
                                />
                            </div>
                            
                            {/* Main Heading */}
                            <div className="space-y-4 animate-slide-up">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-success">
                                Pagamento realizado com sucesso!
                            </h1>
                            
                            <p className="pt-12 text-xl md:text-2xl text-foreground/80 font-medium">Bem vindo(a) <strong>{customerName}</strong>!</p>
                            <p className="text-xl md:text-1xl text-foreground/80 font-medium">
                                Obrigado pela sua compra e por confiar em nossos serviços!
                            </p>
                            </div>
                            
                            {/* Info Section */}
                            <div className="bg-success-light/50 border border-success-border rounded-xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center justify-center gap-2 text-success">
                                    <Mail size={24} />
                                    <span className="font-semibold">Próximos passos</span>
                                </div>
                                
                                <p className="text-foreground/80 leading-relaxed text-lg">
                                    Clique em "Receber credenciais" para enviar um e-mail de confirmação com instruções para realizar o seu cadastro 
                                    para divulgação do seu serviço ou negócio.
                                </p>
                                
                                <div className="flex items-center justify-center gap-2 text-success/80 text-sm">
                                    <CheckCircle2 size={16} />
                                    <span>Após clicar, verifique sua caixa de entrada nos próximos minutos</span>
                                </div>
                            </div>
                            
                            {/* Action Button */}
                            <div className="flex flex-col justify-center items-center sm:flex-row">
                                <SendMailButton 
                                    name={customerName} 
                                    initialPassword={initialPassword} 
                                    email={customerEmail}                            
                                />
                                <div className="pt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                    <Link 
                                        href='/'
                                        className="flex justify-center items-center text-vibrant-pink bg-gradient-primary hover:opacity-90  shadow-elegant px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                                    >
                                        <ArrowLeft className="mr-2" size={20} />
                                        Voltar ao início
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Card>
                    
                    {/* Footer */}
                    <div className="mt-8 text-center text-muted-foreground animate-fade-in flex flex-row sm:flex-col justify-center items-center" style={{ animationDelay: '0.6s' }}>
                        <p className="text-sm">
                            Em caso de dúvidas, entre em contato conosco através do nosso suporte pelo e-mail <strong><a href="mailto:contato@quemindicar.com.br">contato@quemindicar.com.br</a></strong>
                        </p>                                                
                    </div>                        
                </div>
                </div>
            </div>
        )
    }else{
    return ( 
        <div className="flex justify-center items-center flex-col text-center">
            <h1>Ops! Identificamos que você já tem um cadastro com este e-mail!</h1>    
            <h1>Provavelmente você já é cliente da Quem Indicar, e pode obter seus acessos clicando abaixo.</h1>
            <div className="flex flex-col justify-center items-center sm:flex-row">
                <SendMailButton 
                    name={customerName} 
                    initialPassword="Utilize a mesma senha já cadastrada" 
                    email={customerEmail}                    
                />
                <div className="pt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <Link 
                        href='/'
                        className="flex justify-center items-center text-vibrant-pink bg-gradient-primary hover:opacity-90  shadow-elegant px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Voltar ao início
                    </Link>
                </div>
            </div>
        </div>
     );
    }
}
 
export default ConfirmationPage;

