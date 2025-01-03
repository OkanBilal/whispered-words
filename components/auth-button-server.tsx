import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import AuthButtonClient from "./auth-button-client";

// made for server side rendering because when page refreshes, sign in is shown before sign out
// now firstly sessions is checked and then sign in or sign out button is shown by auth-button-client.tsx

export default async function AuthButtonServer() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <AuthButtonClient session={session} />;
}
