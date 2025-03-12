import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { createMemberSchema, modifyMemberSchema } from "../schema";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .get("/workspace-members/:workspaceId", sessionMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");
    const user = c.get("user");

    if (!user) {
      return c.json({ data: "Unauthorized" }, 401);
    }

    const members = await db.workspaceMember.findMany({
      include: {
        Role: { select: { name: true } },
        User: { select: { name: true } },
      },
      where: {
        workspaceId,
      },
    });

    return c.json(members);
  })
  .post(
    "/",
    zValidator("json", createMemberSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const { workspaceId } = c.req.valid("json");

      if (!user) {
        return c.json({ data: "Unauthorized" }, 401);
      }

      const alreadyExists = await db.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId: user.id,
        },
      });
      if (alreadyExists) {
        return c.json({ data: "Unauthorized" }, 401);
      }

      const created = await db.workspaceMember.create({
        data: { workspaceId, userId: user.id },
      });

      return c.json({ data: created });
    }
  )
  .put(
    "/",
    zValidator("json", modifyMemberSchema),
    sessionMiddleware,
    async (c) => {
      const { id, roleId } = c.req.valid("json");

      const updated = await db.workspaceMember.update({
        where: { id },
        data: {
          roleId,
        },
      });

      return c.json({ data: updated });
    }
  );

export default app;
