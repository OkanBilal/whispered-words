"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store";
import { setAuthState } from "@/lib/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { User } from "@supabase/supabase-js";
import { PersonIcon, FileTextIcon, ExitIcon } from "@radix-ui/react-icons";

interface AuthButtonProps {
  session: any; // Replace 'any' with the appropriate type if known
}

export default function AuthButton({ session }: AuthButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const supabase = createClient();
  const user = session?.user as User | undefined;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch(setAuthState(false)); // Update Redux state
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
  ) : (
    <Button
      className=" bg-white hover:bg-neutral-200 text-black  rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-black text-sm font-semibold transition-all duration-200"
      onClick={handleSignIn}
    >
      Login
    </Button>
  );
}
