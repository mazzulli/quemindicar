import WelcomeEmail from "@/components/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailFrom = process.env.RESEND_EMAIL_DOMAIN!;

  try {
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: ["mazzulli@live.com"],
      subject: "Seu acesso para a plataforma Quem Indicar",
      react: WelcomeEmail({ userFirstname: "John" }),
    });
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
