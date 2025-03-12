import "server-only";
import { createMiddleware } from "hono/factory";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { createClientSupabase } from "./supabase";

type AdditionalContext = {
  Variables: {
    user: User | null;
    supabase: SupabaseClient;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const supabase = await createClientSupabase();

    const { data: session } = await supabase.auth.getSession();

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    c.set("user", user);
    c.set("supabase", supabase);

    await next();
  }
);
