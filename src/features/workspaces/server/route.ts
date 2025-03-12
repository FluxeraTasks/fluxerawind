import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, modifyWorkspaceBackendSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { db } from "@/lib/db";

const extractIdFromUrl = (url: string): string => {
  const match = url.match(/\/([^\/]+)$/);
  return match ? match[1] : "";
};

const app = new Hono()
  .get("/my-workspaces", sessionMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ data: "Unauthorized" }, 401);
    }

    const workspaces = await db.workspace.findMany({
      where: {
        OR: [{ userId: user.id }, { Members: { some: { userId: user.id } } }],
      },
    });

    return c.json(workspaces);
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
    });
    return c.json(workspace);
  })
  .get("/", sessionMiddleware, async (c) => {
    const workspaces = await db.workspace.findMany();
    return c.json(workspaces);
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const { title } = c.req.valid("form");

      if (!user) {
        return c.json({ data: "Unauthorized" }, 401);
      }

      const created = await db.workspace.create({
        data: {
          title,
          userId: user.id,
        },
      });

      return c.json({ data: created });
    }
  )
  .put(
    "/",
    zValidator("form", modifyWorkspaceBackendSchema),
    sessionMiddleware,
    async (c) => {
      const supabase = c.get("supabase");
      const { title, image: imageUrl, oldImage, id } = c.req.valid("form");

      console.log(oldImage, imageUrl, oldImage !== imageUrl);

      if (oldImage !== imageUrl) {
        await supabase.storage
          .from("fluxeraimages")
          .remove([extractIdFromUrl(oldImage?.toString() || "")]);
      }

      const created = await db.workspace.update({
        where: { id },
        data: {
          title,
          imageUrl,
        },
      });

      return c.json({ data: created });
    }
  );

export default app;
