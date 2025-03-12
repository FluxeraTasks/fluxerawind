import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createRoleSchema, modifyRoleSchema } from "../schema";

const app = new Hono()
  .get("/workspace-roles/:workspaceId", sessionMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");
    const user = c.get("user");

    if (!user) {
      return c.json({ data: "Unauthorized" }, 401);
    }

    const workspaces = await db.role.findMany({
      where: {
        workspaceId,
      },
    });

    return c.json(workspaces);
  })
  .post(
    "/",
    zValidator("json", createRoleSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");

      if (!user) {
        return c.json({ data: "Unauthorized" }, 401);
      }

      const created = await db.role.create({
        data: c.req.valid("json"),
      });

      return c.json({ data: created });
    }
  )
  .put(
    "/",
    zValidator("json", modifyRoleSchema),
    sessionMiddleware,
    async (c) => {
      const {
        id,
        name,
        canManage,
        getProject,
        postProject,
        putProject,
        delProject,
        getTask,
        postTask,
        putTask,
        delTask,
        getArtifact,
        postArtifact,
        putArtifact,
        delArtifact,
      } = c.req.valid("json");

      const updated = await db.role.update({
        where: { id },
        data: {
          name,
          canManage,
          getProject,
          postProject,
          putProject,
          delProject,
          getTask,
          postTask,
          putTask,
          delTask,
          getArtifact,
          postArtifact,
          putArtifact,
          delArtifact,
        },
      });

      return c.json({ data: updated });
    }
  );

export default app;
