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

export function getInitialsName(fullName: string) {
  if (!fullName) {
    return "";
  }

  // 1. Converte para minúsculas e remove acentos para facilitar a comparação
  let formatedName = fullName
    .toLowerCase()
    .normalize("NFD") // Normaliza para decompor caracteres (ex: 'á' vira 'a' + '´')
    .replace(/[\u0300-\u036f]/g, ""); // Remove os diacríticos (acentos)

  // 2. Remove preposições comuns (de, da, dos, das, e, etc.)
  // As preposições geralmente não são usadas nas iniciais.
  // A regex busca por um espaço, seguido pela preposição, seguido por outro espaço.
  formatedName = formatedName.replace(/\s(de|da|dos|das|do|e|a|o)\s/g, " ");

  // 3. Divide o nome em partes (palavras)
  const partialName = formatedName.split(/\s+/).filter(Boolean); // O .filter(Boolean) remove strings vazias que podem surgir de múltiplos espaços

  // Se não houver partes (ex: nome vazio após o tratamento), retorna vazio
  if (partialName.length === 0) {
    return "";
  }

  // 4. Pega a inicial do primeiro nome
  const firstInitial = partialName[0].charAt(0).toUpperCase();

  // Se houver apenas um nome (ex: "Maria"), retorna apenas a primeira inicial
  if (partialName.length === 1) {
    return firstInitial;
  }

  // 5. Pega a inicial da última parte do nome
  // Pega o último elemento do array e sua primeira letra
  const lastInitial = partialName[partialName.length - 1]
    .charAt(0)
    .toUpperCase();

  // 6. Retorna a concatenação das duas iniciais
  return firstInitial + lastInitial;
}
