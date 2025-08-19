"use server";
import { WelcomeEmail } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  name: string;
  email: string;
  newSecret: string;
};

export default async function SendMail(value: SendEmailProps) {
  const emailFrom = process.env.RESEND_EMAIL_DOMAIN;
  try {
    if (!emailFrom) return;
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: value.email,
      subject: "Seu acesso para a plataforma Quem Indicar",
      react: WelcomeEmail({
        userFirstname: value.name,
        email: value.email,
        pwd: value.newSecret,
      }),
    });

    if (error) {
      return { error: error };
    }

    return { status: 200, data: data };
  } catch (error) {
    return { error: error };
  }
}
