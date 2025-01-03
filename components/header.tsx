import { Span } from "./ui/text";
import AuthButton from "./auth-button-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="flex items-center justify-between py-6 px-6 sm:py-8 sm:px-24">
      <div>
        <Span className="text-xl md:text-2xl mr-1 text-gradient">🌬️</Span>
        <Span className="text-lg md:text-xl font-semibold text-gradient ">
          Whispered Words
        </Span>
      </div>
      <div>
        {session ? (
          <a href="/profile" className="text-white mr-8">
            Profile
          </a>
        ) : null}
        <AuthButton session={session} />
      </div>
    </header>
  );
}
