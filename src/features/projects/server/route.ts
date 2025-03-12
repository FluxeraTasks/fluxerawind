import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProjectSchema, modifyProjectSchema } from "../schema";

const app = new Hono()
  .get(
    "/workspace-projects/:workspaceId/:projectId",
    sessionMiddleware,
    async (c) => {
      const projectId = c.req.param("projectId");
      const user = c.get("user");

      if (!user) {
        return c.json({ data: "Unauthorized" }, 401);
      }

      const projects = await db.project.findUnique({
        include: {
          Members: { include: { User: {} } },
          Features: { include: { Artifacts: {} } },
        },
        where: {
          id: projectId,
        },
      });

      return c.json(projects);
    }
  )
  .get("/workspace-projects/:workspaceId", sessionMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");
    const user = c.get("user");

    if (!user) {
      return c.json({ data: "Unauthorized" }, 401);
    }

    const projects = await db.project.findMany({
      where: {
        workspaceId,
      },
    });

    return c.json(projects);
  })
  .post(
    "/",
    zValidator("json", createProjectSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");

      const project = c.req.valid("json");

      if (!user) {
        return c.json({ data: "Unauthorized" }, 401);
      }

      const created = await db.project.create({
        data: { ...project, userId: user.id },
      });

      return c.json({ data: created });
    }
  )
  .put(
    "/",
    zValidator("json", modifyProjectSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const { id, title, closed, obsolete } = c.req.valid("json");

      if (!user) {
        return c.json({ data: "Unauthorized" }, 401);
      }

      const created = await db.project.update({
        data: { title, closed, obsolete },
        where: { id },
      });

      return c.json({ data: created });
    }
  );

export default app;
