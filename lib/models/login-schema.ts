import { z } from "zod";

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(1),
});

type LoginSchema = z.infer<typeof loginSchema>;

export { loginSchema, type LoginSchema };
