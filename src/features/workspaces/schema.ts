import { z } from "zod";

export const createWorkspaceSchema = z.object({
  title: z.string().trim().min(1, "Obrigatório"),
});

export const modifyWorkspaceBackendSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Obrigatório"),
  image: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  oldImage: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
});
