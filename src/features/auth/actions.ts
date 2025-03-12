"use server";

import { createClientSupabase } from "@/lib/supabase";

export const getCurrent = async () => {
  try {
    const supabase = await createClientSupabase();

    const { data } = await supabase.auth.getSession();

    if (!data) return null;

    return data.session?.access_token;
  } catch (e) {
    console.log("Erro no ActionGetCurrent", e);
    return null;
  }
};
