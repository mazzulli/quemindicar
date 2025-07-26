"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function uploadImage(
  formData: FormData,
  providerName: string
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const file = formData.get("photo") as File;

    if (!file) {
      return { success: false, error: "Nenhum arquivo selecionado" };
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP",
      };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Arquivo muito grande. Tamanho máximo: 5MB",
      };
    }

    // Create imageFiles directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "imageFiles");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate filename: providerName_YYYYMMDD_HHMMSS.extension
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS

    // Clean provider name for filename (remove special characters)
    const cleanProviderName = providerName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]/g, "_") // Replace special chars with underscore
      .replace(/_+/g, "_") // Replace multiple underscores with single
      .replace(/^_|_$/g, ""); // Remove leading/trailing underscores

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${cleanProviderName}_${dateStr}_${timeStr}.${fileExtension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return relative path for database storage
    const relativePath = `/imageFiles/${fileName}`;

    return {
      success: true,
      filePath: relativePath,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: "Erro interno do servidor ao fazer upload da imagem",
    };
  }
}

export async function deleteImage(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!filePath || !filePath.startsWith("/imageFiles/")) {
      return { success: false, error: "Caminho de arquivo inválido" };
    }

    const fullPath = join(process.cwd(), "public", filePath);

    if (existsSync(fullPath)) {
      const { unlink } = await import("fs/promises");
      await unlink(fullPath);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      error: "Erro ao excluir arquivo",
    };
  }
}
