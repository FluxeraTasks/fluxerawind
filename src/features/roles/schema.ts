import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, "Obrigatório"),
  workspaceId: z.string(),

  canManage: z.boolean(),

  getProject: z.boolean(),
  postProject: z.boolean(),
  putProject: z.boolean(),
  delProject: z.boolean(),

  getArtifact: z.boolean(),
  postArtifact: z.boolean(),
  putArtifact: z.boolean(),
  delArtifact: z.boolean(),

  getTask: z.boolean(),
  postTask: z.boolean(),
  putTask: z.boolean(),
  delTask: z.boolean(),
});

export const modifyRoleSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Obrigatório"),
  workspaceId: z.string(),

  canManage: z.boolean(),

  getProject: z.boolean(),
  postProject: z.boolean(),
  putProject: z.boolean(),
  delProject: z.boolean(),

  getArtifact: z.boolean(),
  postArtifact: z.boolean(),
  putArtifact: z.boolean(),
  delArtifact: z.boolean(),

  getTask: z.boolean(),
  postTask: z.boolean(),
  putTask: z.boolean(),
  delTask: z.boolean(),
});
