"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { providerSchema, providerUpdateSchema } from "@/lib/validations";

// Add the uploadImage import at the top
import { uploadImage, deleteImage } from "./upload";

export async function getProviders(filters?: {
  search?: string;
  categoryId?: number;
  active?: boolean;
}) {
  try {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { subtitle: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.active !== undefined) {
      where.active = filters.active;
    }

    const providers = await prisma.provider.findMany({
      where,
      include: {
        category: true,
        ratings: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: {
        ratings: {
          _count: "desc",
        },
      },
    });

    return {
      success: true,
      data: providers.map((provider) => ({
        id: provider.id,
        title: provider.title,
        subtitle: provider.subtitle,
        category: provider.category,
        description: provider.description,
        photoUrl: provider.photoUrl,
        phone: provider.phone,
        email: provider.email,
        address: provider.address,
        website: provider.website,
        instagram: provider.instagram,
        facebook: provider.facebook,
        youtube: provider.youtube,
        linkedin: provider.linkedin,
        tiktok: provider.tiktok,
        active: provider.active,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
        averageRating:
          provider.ratings.length > 0
            ? provider.ratings.reduce((sum, r) => sum + r.rating, 0) /
              provider.ratings.length
            : 0,
        ratingsCount: provider._count.ratings,
      })),
    };
  } catch (error) {
    console.error("Error fetching providers:", error);
    return {
      success: false,
      error: "Erro ao buscar prestadores",
    };
  }
}

export async function getProviderById(id: number) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        category: true,
        ratings: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!provider) {
      return {
        success: false,
        error: "Prestador não encontrado",
      };
    }

    const averageRating =
      provider.ratings.length > 0
        ? provider.ratings.reduce((sum, r) => sum + r.rating, 0) /
          provider.ratings.length
        : 0;

    return {
      success: true,
      data: {
        ...provider,
        averageRating,
        ratingsCount: provider._count.ratings,
      },
    };
  } catch (error) {
    console.error("Error fetching provider:", error);
    return {
      success: false,
      error: "Erro ao buscar prestador",
    };
  }
}

// Update the createProvider function to handle file upload
export async function createProvider(formData: FormData) {
  try {
    // Extract form data
    const data = {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      categoryId: Number(formData.get("categoryId")),
      description: formData.get("description") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      website: formData.get("website") as string,
      instagram: formData.get("instagram") as string,
      facebook: formData.get("facebook") as string,
      youtube: formData.get("youtube") as string,
      linkedin: formData.get("linkedin") as string,
      tiktok: formData.get("tiktok") as string,
    };

    const validatedData = providerSchema.parse(data);

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return {
        success: false,
        error: "Categoria não encontrada",
      };
    }

    // valida email
    const emailExists = await prisma.provider.findFirst({
      where: { email: validatedData.email },
    });

    console.log("emailExists salvando dados: ", emailExists?.email);
    if (
      emailExists?.email &&
      emailExists.email !== "sememail@email.com.br" &&
      emailExists.email !== "mazzulli@live.com"
    ) {
      return {
        success: false,
        error: "Já existe um prestador com este e-mail",
      };
    }

    // Handle image upload if file is present
    let photoUrl: string | null = null;
    const photoFile = formData.get("photo") as File;

    if (photoFile && photoFile.size > 0) {
      const uploadResult = await uploadImage(formData, validatedData.title);

      if (!uploadResult.success) {
        return {
          success: false,
          error: uploadResult.error || "Erro ao fazer upload da imagem",
        };
      }

      photoUrl = uploadResult.filePath || null;
    }

    // Clean empty strings to null for optional fields
    const cleanedData = {
      ...validatedData,
      subtitle: validatedData.subtitle || null,
      description: validatedData.description || null,
      photoUrl,
      address: validatedData.address || null,
      website: validatedData.website || null,
      instagram: validatedData.instagram || null,
      facebook: validatedData.facebook || null,
      youtube: validatedData.youtube || null,
      linkedin: validatedData.linkedin || null,
      tiktok: validatedData.tiktok || null,
    };

    const provider = await prisma.provider.create({
      data: cleanedData,
      include: {
        category: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: provider,
      message: "Prestador criado com sucesso",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Erro ao criar prestador",
    };
  }
}

// Update the updateProvider function to handle file upload and deletion
export async function updateProvider(formData: FormData) {
  try {
    // Extract form data
    const data = {
      id: Number(formData.get("id")),
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      categoryId: Number(formData.get("categoryId")),
      description: formData.get("description") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      website: formData.get("website") as string,
      instagram: formData.get("instagram") as string,
      facebook: formData.get("facebook") as string,
      youtube: formData.get("youtube") as string,
      linkedin: formData.get("linkedin") as string,
      tiktok: formData.get("tiktok") as string,
    };

    const validatedData = providerUpdateSchema.parse(data);

    // Check if provider exists
    const existingProvider = await prisma.provider.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingProvider) {
      return {
        success: false,
        error: "Prestador não encontrado",
      };
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return {
        success: false,
        error: "Categoria não encontrada",
      };
    }

    // Handle image upload if new file is present
    let photoUrl: string | null = existingProvider.photoUrl;
    const photoFile = formData.get("photo") as File;
    const removePhoto = formData.get("removePhoto") === "true";

    if (removePhoto) {
      // Remove existing photo
      if (existingProvider.photoUrl) {
        await deleteImage(existingProvider.photoUrl);
      }
      photoUrl = null;
    } else if (photoFile && photoFile.size > 0) {
      // Upload new photo
      const uploadResult = await uploadImage(formData, validatedData.title);

      if (!uploadResult.success) {
        return {
          success: false,
          error: uploadResult.error || "Erro ao fazer upload da imagem",
        };
      }

      // Delete old photo if exists
      if (existingProvider.photoUrl) {
        await deleteImage(existingProvider.photoUrl);
      }

      photoUrl = uploadResult.filePath || null;
    }

    // Clean empty strings to null for optional fields
    const cleanedData = {
      title: validatedData.title,
      subtitle: validatedData.subtitle || null,
      categoryId: validatedData.categoryId,
      description: validatedData.description || null,
      photoUrl,
      phone: validatedData.phone,
      email: validatedData.email,
      address: validatedData.address || null,
      website: validatedData.website || null,
      instagram: validatedData.instagram || null,
      facebook: validatedData.facebook || null,
      youtube: validatedData.youtube || null,
      linkedin: validatedData.linkedin || null,
      tiktok: validatedData.tiktok || null,
    };

    const provider = await prisma.provider.update({
      where: { id: validatedData.id },
      data: cleanedData,
      include: {
        category: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: provider,
      message: "Prestador atualizado com sucesso",
    };
  } catch (error) {
    console.error("Error updating provider:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Erro ao atualizar prestador",
    };
  }
}

// Update the deleteProvider function to also delete the image file
export async function deleteProvider(id: number) {
  try {
    // Check if provider exists
    const existingProvider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!existingProvider) {
      return {
        success: false,
        error: "Prestador não encontrado",
      };
    }

    // Delete image file if exists
    if (existingProvider.photoUrl) {
      await deleteImage(existingProvider.photoUrl);
    }

    await prisma.provider.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Prestador excluído com sucesso",
    };
  } catch (error) {
    console.error("Error deleting provider:", error);
    return {
      success: false,
      error: "Erro ao excluir prestador",
    };
  }
}

export async function toggleProviderStatus(id: number) {
  try {
    const existingProvider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!existingProvider) {
      return {
        success: false,
        error: "Prestador não encontrado",
      };
    }

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        active: !existingProvider.active,
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: provider,
      message: `Prestador ${
        provider.active ? "ativado" : "desativado"
      } com sucesso`,
    };
  } catch (error) {
    console.error("Error toggling provider status:", error);
    return {
      success: false,
      error: "Erro ao alterar status do prestador",
    };
  }
}
