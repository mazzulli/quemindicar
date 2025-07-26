"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { categorySchema, categoryUpdateSchema, type CategoryInput, type CategoryUpdateInput } from "@/lib/validations"

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            providers: {
              where: {
                active: true,
              },
            },
          },
        },
      },
    })

    return {
      success: true,
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        providersCount: category._count.providers,
      })),
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return {
      success: false,
      error: "Erro ao buscar categorias",
    }
  }
}

export async function getCategoryById(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            providers: {
              where: {
                active: true,
              },
            },
          },
        },
      },
    })

    if (!category) {
      return {
        success: false,
        error: "Categoria não encontrada",
      }
    }

    return {
      success: true,
      data: {
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        providersCount: category._count.providers,
      },
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    return {
      success: false,
      error: "Erro ao buscar categoria",
    }
  }
}

export async function createCategory(input: CategoryInput) {
  try {
    const validatedData = categorySchema.parse(input)

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name },
    })

    if (existingCategory) {
      return {
        success: false,
        error: "Já existe uma categoria com este nome",
      }
    }

    const category = await prisma.category.create({
      data: validatedData,
    })

    revalidatePath("/categorias")
    revalidatePath("/cadastro")
    revalidatePath("/dashboard")

    return {
      success: true,
      data: category,
      message: "Categoria criada com sucesso",
    }
  } catch (error) {
    console.error("Error creating category:", error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: "Erro ao criar categoria",
    }
  }
}

export async function updateCategory(input: CategoryUpdateInput) {
  try {
    const validatedData = categoryUpdateSchema.parse(input)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: validatedData.id },
    })

    if (!existingCategory) {
      return {
        success: false,
        error: "Categoria não encontrada",
      }
    }

    // Check if name is already taken by another category
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: validatedData.name,
        id: { not: validatedData.id },
      },
    })

    if (duplicateCategory) {
      return {
        success: false,
        error: "Já existe uma categoria com este nome",
      }
    }

    const category = await prisma.category.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
      },
    })

    revalidatePath("/categorias")
    revalidatePath("/cadastro")
    revalidatePath("/dashboard")

    return {
      success: true,
      data: category,
      message: "Categoria atualizada com sucesso",
    }
  } catch (error) {
    console.error("Error updating category:", error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: "Erro ao atualizar categoria",
    }
  }
}

export async function deleteCategory(id: number) {
  try {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            providers: true,
          },
        },
      },
    })

    if (!existingCategory) {
      return {
        success: false,
        error: "Categoria não encontrada",
      }
    }

    // Check if category has providers
    if (existingCategory._count.providers > 0) {
      return {
        success: false,
        error: "Não é possível excluir uma categoria que possui prestadores vinculados",
      }
    }

    await prisma.category.delete({
      where: { id },
    })

    revalidatePath("/categorias")
    revalidatePath("/cadastro")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Categoria excluída com sucesso",
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    return {
      success: false,
      error: "Erro ao excluir categoria",
    }
  }
}
