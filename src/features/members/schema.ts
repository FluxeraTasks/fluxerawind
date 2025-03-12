import { z } from "zod";

export const createMemberSchema = z.object({
  workspaceId: z.string(),
});

export const modifyMemberSchema = z.object({
  id: z.string(),
  roleId: z.string(),
});

export interface membersSchema {
  User: {
    name: string;
  } | null;
  Role: {
    name: string;
  } | null;
  workspaceId: string;
  id: string;
  userId: string;
  createdAt: string | null;
  updatedAt: string | null;
  roleId: string | null;
}
