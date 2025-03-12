import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().trim().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email().trim().min(1),
  password: z.string().min(1).max(100),
  name: z.string().min(1),
});
