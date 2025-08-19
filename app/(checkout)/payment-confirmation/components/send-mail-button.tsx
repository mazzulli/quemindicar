'use client'

import SendEmail from "@/app/api/sendEmail";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner"

type SendMailButtonProps = {
    initialPassword: string
    name: string
    email: string    
}

const SendMailButton = ({initialPassword, name, email }: SendMailButtonProps) => {
    const [disabled, setDisabled] = useState<boolean>(false);
    
    const handleSendEmail = async () => {
        const response = await SendEmail({newSecret: initialPassword, name: name, email: email});
        if (response?.error) {
            toast("Ops", {
                description: "Parece que houve um erro ao enviar o e-mail. Por favor, tente novamente mais tarde.",                
            })
        }else{
            toast(`Aviso: ${email}`, {
                description: "E-mail enviado com sucesso! Verifique sua caixa de entrada.",
            })
            setDisabled(true);            
        }
    }
    return ( 
        <Button
            className="mt-12"
            onClick={handleSendEmail}
            disabled={disabled}
        >

            Receber credenciais
        </Button>
     );
}
 
export default SendMailButton;