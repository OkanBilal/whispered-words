"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  session: any; // Replace 'any' with the appropriate type if known
}

export default function AuthButton({ session }: AuthButtonProps) {
  const router = useRouter();

  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  return session ? (
    <Button
      className=" bg-white hover:bg-neutral-200 text-black  rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-gray-800 text-sm font-semibold transition-all duration-200"
      onClick={handleSignOut}
    >
      Logout
    </Button>
  ) : (
    <Button
      className=" bg-white hover:bg-neutral-200 text-black  rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-gray-800 text-sm font-semibold transition-all duration-200"
      onClick={handleSignIn}
    >
      Login
    </Button>
  );
}
