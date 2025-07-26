"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { ratingSchema, type RatingInput } from "@/lib/validations"

export async function getRatingsByProvider(providerId: number) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { providerId },
      orderBy: {
        createdAt: "desc",
      },
    })

    const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

    return {
      success: true,
      data: {
        ratings,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
      },
    }
  } catch (error) {
    console.error("Error fetching ratings:", error)
    return {
      success: false,
      error: "Erro ao buscar avaliações",
    }
  }
}

export async function createRating(input: RatingInput) {
  try {
    const validatedData = ratingSchema.parse(input)

    // Check if provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: validatedData.providerId },
    })

    if (!provider) {
      return {
        success: false,
        error: "Prestador não encontrado",
      }
    }

    const cleanedData = {
      ...validatedData,
      comment: validatedData.comment || null,
    }

    const rating = await prisma.rating.create({
      data: cleanedData,
    })

    revalidatePath("/")
    revalidatePath("/dashboard")

    return {
      success: true,
      data: rating,
      message: "Avaliação criada com sucesso",
    }
  } catch (error) {
    console.error("Error creating rating:", error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: "Erro ao criar avaliação",
    }
  }
}

export async function deleteRating(id: number) {
  try {
    const existingRating = await prisma.rating.findUnique({
      where: { id },
    })

    if (!existingRating) {
      return {
        success: false,
        error: "Avaliação não encontrada",
      }
    }

    await prisma.rating.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Avaliação excluída com sucesso",
    }
  } catch (error) {
    console.error("Error deleting rating:", error)
    return {
      success: false,
      error: "Erro ao excluir avaliação",
    }
  }
}
