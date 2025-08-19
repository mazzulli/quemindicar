"use server";

import { userSchema } from "../validations";
import { prisma } from "../prisma";
import { verifyPassword } from "../utils";
import { User } from "@prisma/client";

export type UserProps = {
  name: string;
  email: string;
  passwordHash: string;
  role: "Admin" | "Customer";
  active: boolean;
};

export async function createUser(data: UserProps) {
  try {
    const validatedData = userSchema.parse(data);
    const { ...userData } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Já existe um usuário com este email",
      };
    }

    console.log("VOU CRIAR O REGISTRO");
    const user = await prisma.user.create({
      data: userData,
    });

    return {
      success: true,
      data: user,
      message: "Usuário criado com sucesso",
    };
  } catch (error) {
    console.error("Error creating USER:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Erro ao criar categoria",
    };
  }
}

export async function validateLogin(email: string, password: string) {
  try {
    // localizar cliente pelo email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user?.id) {
      throw new Error("Usuário ou senha não localizado");
    }

    const result = await verifyPassword(password, user.passwordHash);

    return { user: user, result: result };
  } catch (error) {
    throw error;
  }
}
