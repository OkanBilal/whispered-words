"use client";
import { Span } from "./ui/text";
import AuthButton from "./auth-button-client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch, useAppSelector } from "@/lib/redux";
import { setAuthState } from "@/lib/redux";

export default function Header() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth.authState);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        dispatch(setAuthState(!!session));
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      dispatch(setAuthState(!!newSession));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, supabase]);

  return (
    <header className="flex items-center justify-between py-6 px-6 sm:py-8 sm:px-24">
      <div>
        <Span className="text-xl md:text-2xl mr-1 text-gradient">🌬️</Span>
        <Span className="text-lg md:text-xl font-semibold text-gradient ">
          <a href="/">Whispered Words</a>
        </Span>
      </div>
      <div className="flex items-center">

        <AuthButton session={session} />
      </div>
    </header>
  );
}
