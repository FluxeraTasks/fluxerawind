import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../schema";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "@/lib/constants";
import { createClientSupabase } from "@/lib/supabase";
import { sessionMiddleware } from "@/lib/session-middleware";
import { db } from "@/lib/db";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { data } = await supabase.auth.getSession();
    return c.json({
      data: {
        email: data.session?.user.email || "",
        name: data.session?.user?.user_metadata.display_name || "",
      },
    });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const supabase = await createClientSupabase();
    const { email, password } = c.req.valid("json");

    const session = await supabase.auth.signInWithPassword({ email, password });

    if (!session.data.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    setCookie(c, AUTH_COOKIE, session.data.session.access_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const supabase = await createClientSupabase();
    const { email, password, name } = c.req.valid("json");

    const { data: newUser, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });

    if (error || !newUser) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (newUser && newUser.user) {
      await db.user.create({
        data: {
          email,
          id: newUser.user.id,
          name,
          Workspaces: { create: { title: `🔒 - ${name}` } },
        },
      });
    }

    return c.json({ success: true });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const supabase = c.get("supabase");

    await supabase.auth.signOut();

    deleteCookie(c, AUTH_COOKIE);
    return c.json({ success: true });
  });

export default app;
