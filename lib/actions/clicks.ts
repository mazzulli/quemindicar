"use server";

import { prisma } from "@/lib/prisma";

const RegisterClick = async (providerId: number) => {
  try {
    if (!providerId) {
      throw new Error("ID do prestador é obrigatório.");
    }
    await prisma.clicksCounter.create({
      data: {
        providerId: providerId,
      },
    });
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao registrar clique.",
    };
  }
  return {
    success: true,
    message: "Clique registrado com sucesso.",
  };
};

const getClicksByProvider = async (providerId: number) => {
  const clicks = await prisma.clicksCounter.count({
    where: {
      providerId: providerId,
    },
  });
  return clicks;
};

const getClicksGroup = async () => {
  const clicks = await prisma.clicksCounter.groupBy({
    by: ["providerId"],
    _count: {
      _all: true,
    },
    orderBy: {
      _count: {
        providerId: "desc",
      },
    },
  });
  return clicks;
};

export { RegisterClick, getClicksByProvider, getClicksGroup };
