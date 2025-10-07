import { z } from "zod";
import { stripe } from "./stripe";

// User validations
export const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, "Nome é obrigatório")
    .max(80, "Nome deve ter no máximo 80 caracteres")
    .trim(),
  email: z.string().email(),
  passwordHash: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(255),
  role: z.enum(["Administrator", "Customer"], {
    errorMap: () => ({
      message: "Tipo de acesso deve ser 'Administrador' ou 'Cliente'",
    }),
  }),
  active: z.boolean(),
  stripeCustomerId: z.string().optional(),
});

export const userUpdateSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, "Nome é obrigatório")
    .max(80, "Nome deve ter no máximo 80 caracteres")
    .trim(),
  email: z.string().email(),
  passwordHash: z.string().min(8).max(16).optional(),
  role: z.enum(["Administrator", "Customer"], {
    errorMap: () => ({ message: "Role deve ser 'Admin' ou 'Customer'" }),
  }),
  stripeCustomerId: z.string().optional(),
});

// Category validations
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nome da categoria é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
});

export const categoryUpdateSchema = categorySchema.extend({
  id: z.number().int().positive(),
});

// Provider validations
// Update the provider schema to make photoUrl optional since it will be handled by the server action
export const providerSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres")
    .trim(),
  subtitle: z
    .string()
    .max(200, "Subtítulo deve ter no máximo 200 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  categoryId: z.number().int().positive("Categoria é obrigatória"),
  description: z.string().optional().or(z.literal("")),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .trim(),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email deve ser válido")
    .max(80, "Email deve ter no máximo 80 caracteres")
    .trim(),
  zipCode: z
    .string()
    .max(9, "CEP deve ter no máximo 9 caracteres")
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  number: z
    .string()
    .max(10, "Número deve ter no máximo 10 caracteres")
    .optional()
    .or(z.literal("")),
  complement: z
    .string()
    .max(50, "Complemento deve ter no máximo 50 caracteres")
    .optional()
    .or(z.literal("")),
  neighborhood: z
    .string()
    .max(50, "Bairro deve ter no máximo 50 caracteres")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(50, "Cidade deve ter no máximo 50 caracteres")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .max(2, "Estado deve ter no máximo 2 caracteres")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Website deve ser uma URL válida")
    .max(300, "Website deve ter no máximo 300 caracteres")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .max(100, "Instagram deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  facebook: z
    .string()
    .max(100, "Facebook deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  youtube: z
    .string()
    .max(100, "YouTube deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .max(100, "LinkedIn deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  tiktok: z
    .string()
    .max(100, "TikTok deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
});

export const providerUpdateSchema = providerSchema.extend({
  id: z.number().int().positive(),
});

// Rating validations
export const ratingSchema = z.object({
  providerId: z.number().int().positive(),
  reviewerName: z
    .string()
    .min(1, "Nome do avaliador é obrigatório")
    .max(200, "Nome deve ter no máximo 200 caracteres")
    .trim(),
  rating: z
    .number()
    .int()
    .min(1, "Avaliação deve ser entre 1 e 5")
    .max(5, "Avaliação deve ser entre 1 e 5"),
  comment: z.string().optional().or(z.literal("")),
});

// Types
export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
// Remove photoUrl from the input type since it's handled server-side
export type ProviderInput = z.infer<typeof providerSchema>;
export type ProviderUpdateInput = z.infer<typeof providerUpdateSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
