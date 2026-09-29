import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "missing-publishable-key";

export const supabase = createClient<Database>(url, publishableKey);

let publicSessionPromise: Promise<void> | null = null;
/** The public configuration queries need a JWT under the currently deployed RLS policies. */
export function ensurePublicSession(): Promise<void> {
  if (!publicSessionPromise) {
    publicSessionPromise = supabase.auth.getSession()
      .then(async ({ data }) => {
        if (!data.session) await supabase.auth.signInAnonymously();
      })
      .then(() => undefined)
      .catch(() => undefined);
  }
  return publicSessionPromise;
}
