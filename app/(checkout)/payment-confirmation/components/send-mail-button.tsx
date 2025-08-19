'use client'

import SendEmail from "@/app/api/sendEmail";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type SendMailButtonProps = {
    initialPassword: string
    name: string
    email: string
}

const SendMailButton = ({initialPassword, name, email}: SendMailButtonProps) => {
    const handleSendEmail = async () => {
        const response = await SendEmail({newSecret: initialPassword, name: name, email: email});
        if (response?.error) {
            toast({
                title: "Erro ao enviar email",
                description: "Ocorreu um erro ao enviar o email. Por favor, tente novamente mais tarde.",
                variant: "destructive",
            })
        } else {
            console.log("Email sent successfully:", response?.data);
            toast({
                title: "Email enviado com sucesso",
                description: "As credenciais foram enviadas para o seu email.",
                variant: "default",
            })

        }
    }
    return ( 
        <Button
            className="mt-12"
            onClick={handleSendEmail}>
            Receber credenciais
        </Button>
     );
}
 
export default SendMailButton;