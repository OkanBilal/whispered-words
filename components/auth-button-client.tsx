"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { setAuthState } from "@/lib/redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { User } from "@supabase/supabase-js";
import { PersonIcon, FileTextIcon, ExitIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/redux";

interface AuthButtonProps {
  session: any; 
}

export default function AuthButton({ session }: AuthButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const supabase = createClient();
  const user = session?.user as User | undefined;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session !== undefined) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch(setAuthState(false));
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

  if (isLoading) {
    return (
      <div className="h-8 w-8 flex items-center justify-center">
        <svg
          className="size-5 animate-spin text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  const AvatarComponent = (
    <Popover>
      <PopoverTrigger>
        <div className="relative h-8 w-8 rounded-full cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt="User avatar"
            />
            <AvatarFallback>
              {user?.email?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-52 bg-black border-black text-white"
        align="end"
      >
        <div className="grid gap-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">{user?.email}</p>
            <p className="text-xs text-gray-400">
              {user?.user_metadata?.name || "User"}
            </p>
          </div>
          <div className="grid gap-2 ">
            <Button
              className="justify-start bg-black text-white hover:bg-black h-9 px-2 w-full outline-none focus:outline-none"
              leftIcon={<PersonIcon className="h-4 w-4" />}
              onClick={() => router.push("/profile")}
            >
              Profile
            </Button>
            <Button
              className="justify-start bg-black text-white hover:bg-black h-9 px-2 w-full outline-none focus:outline-none"
              leftIcon={<FileTextIcon className="h-4 w-4" />}
              onClick={() => router.push("/transcriptions")}
            >
              My Transcriptions
            </Button>
            <Button
              className="justify-start bg-black hover:bg-black h-9 px-2 w-full outline-none focus:outline-none"
              leftIcon={<ExitIcon className="h-4 w-4 text-red-500" />}
              textClass="text-red-500"
              onClick={handleSignOut}
            >
              Logout
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const LoginComponent = (
    <Button
      className="bg-white hover:bg-neutral-200 text-black rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-black text-sm font-semibold"
      onClick={handleSignIn}
    >
      Login
    </Button>
  );

  return session ? AvatarComponent : LoginComponent;
}
