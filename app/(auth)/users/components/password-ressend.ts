"use server";

import SendMail from "@/app/api/sendEmail";
import { toast } from "@/hooks/use-toast";
import { updateUser, updateUserPassword } from "@/lib/actions/users";
import { generatePassword } from "@/lib/utils";

const PasswordRessend = async (id: string, email: string, name: string) => {
  // gerar nova senha
  const newSecret =
    "qi@" + email.substring(0, email.indexOf("@")) + generatePassword();

  console.log("New secret: ", newSecret);

  // atualizar senha no banco
  const saveNewPassword = await updateUserPassword(id, {
    password: newSecret,
  });

  console.log("Save new password: ", saveNewPassword);

  // se sucesso enviar email
  if (saveNewPassword && !saveNewPassword.error) {
    const sentEmail = await SendMail({
      newSecret: newSecret,
      name: name,
      email: email,
    });

    console.log("Sent email: ", sentEmail);

    if (sentEmail && !sentEmail.error) {
      return { success: "Email enviado com sucesso" };
    } else {
      return { error: "Erro ao enviar email" };
    }
  }
};

export default PasswordRessend;
