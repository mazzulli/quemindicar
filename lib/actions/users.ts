"use server";

import { userSchema, userUpdateSchema } from "../validations";
import { prisma } from "../prisma";
import { hashPassword, verifyPassword } from "../utils";
import { revalidatePath } from "next/cache";

export type UserProps = {
  name: string;
  email: string;
  passwordHash: string;
  role: "Administrator" | "Customer";
  active: boolean;
};

export async function createUser(data: UserProps) {
  try {
    console.log("Creating user with data:", data);
    const validatedData = userSchema.parse(data);

    console.log("DEPOIS DE VALIDAR O SCHEMA");

    const { ...userData } = validatedData;

    console.log("VERIFICANDO SE USUÁRIO JÁ EXISTE PELO EMAIL:", userData.email);
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Já existe um usuário com este email",
      };
    }

    console.log("INICAR GRAVAÇÃO: ", userData);
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

export async function updateUser(formData: FormData) {
  try {
    // Extract form data
    const data: any = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
    };

    const passwordHash = formData.get("newPassword") as string;

    // Only include passwordHash if it's provided and not empty
    if (passwordHash && passwordHash.trim() !== "") {
      data.passwordHash = passwordHash;
    }

    // Validate data with zod
    const validatedData = userUpdateSchema.parse(data);

    //hash new password if provided
    try {
      if (validatedData.passwordHash !== "") {
        const passwordHashed = await hashPassword(
          validatedData.passwordHash as string
        );
        validatedData.passwordHash = passwordHashed;
      }
    } catch (error) {
      console.error("Error hashing password:", error);
    }

    // Check if provider exists
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingUser) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: validatedData.id },
      data: validatedData,
    });

    revalidatePath("/");
    revalidatePath("/users");

    return {
      success: true,
      data: user,
      message: "Usuário atualizado com sucesso",
    };
  } catch (error) {
    console.error("Error updating user:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Erro ao atualizar usuário",
    };
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: "Erro ao buscar usuários",
    };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    return {
      success: true,
      data: {
        ...user,
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: "Erro ao buscar usuário",
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

export async function toggleUserStatus(id: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        active: !existingUser.active,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: user,
      message: `Usuário ${user.active ? "ativado" : "desativado"} com sucesso`,
    };
  } catch (error) {
    console.error("Error toggling provider status:", error);
    return {
      success: false,
      error: "Erro ao alterar status do usuário",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    // Check if provider exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Usuário excluído com sucesso",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: "Erro ao excluir usuário",
    };
  }
}

export async function updateUserPassword(
  id: string,
  data: { password: string }
) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.update({
      where: { id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    revalidatePath("/");
    revalidatePath("/users");

    return {
      success: true,
      data: user,
      message: "Senha atualizada com sucesso",
    };
  } catch (error) {
    console.error("Error updating user password:", error);
    return {
      success: false,
      error: "Erro ao atualizar senha do usuário",
    };
  }
}
