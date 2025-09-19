import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  console.log("VALIDAR SENHA: ", password);
  return await bcrypt.compare(password, hashedPassword);
}

export function generatePassword() {
  const length = 4;
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Função auxiliar para formatar o número
export function formatPhoneNumber(phoneNumber: string) {
  // Remove todos os caracteres que não sejam dígitos
  let cleaned = ("" + phoneNumber).replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // Padrão para 11 dígitos: (xx) xxxxx-xxxx
  if (cleaned.length >= 10 && cleaned.length <= 11) {
    // Adiciona o parêntese inicial e final
    let ddd = cleaned.substring(0, 2);
    let firstPart;
    let secondPart;

    if (cleaned.length === 11) {
      firstPart = cleaned.substring(2, 7);
      secondPart = cleaned.substring(7, 11);
    } else {
      // 10 dígitos
      firstPart = cleaned.substring(2, 6);
      secondPart = cleaned.substring(6, 10);
    }

    return `(${ddd}) ${firstPart}-${secondPart}`;
  }

  return cleaned; // Retorna o valor limpo se o comprimento não for válido
}
