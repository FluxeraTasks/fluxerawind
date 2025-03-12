import { Prisma } from "@prisma/client";
import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Obrigatório"),
  workspaceId: z.string(),
  closed: z.boolean(),
  obsolete: z.boolean(),
});

export const modifyProjectSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Obrigatório"),
  closed: z.boolean(),
  obsolete: z.boolean(),
});

export type ProjectWithRelationsSchema = Prisma.ProjectGetPayload<{
  include: {
    Members: { include: { User: true } };
    Features: { include: { Artifacts: true } };
  };
}>;
