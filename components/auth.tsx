"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Github, Google } from "./icons";
import { P, Span } from "./ui/text";
import { usePathname } from "next/navigation";

export function Auth() {
  const pathname = usePathname();

  console.log("pathname", pathname);

  return (
    <div className="text-white w-full max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {pathname === "/sign-up" ? "Create an account" : "Login account"}{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button
              leftIcon={<Github color="#fff" />}
              className="bg-black justify-center hover:bg-neutral-900 text-white rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-neutral-800 text-sm font-semibold transition-all duration-200"
            >
              <span>Github</span>
            </Button>
            <Button
              leftIcon={<Google />}
              className="bg-black justify-center hover:bg-neutral-900 text-white rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-neutral-800 text-sm font-semibold transition-all duration-200 "
            >
              <span>Google</span>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full " />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="me@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          {pathname === "/sign-up" ? (
            <Span className="text-sm text-center  ">
              Have an account?{" "}
              <a className="underline" href="/sign-in">
                Sign in
              </a>
            </Span>
          ) : (
            <Span className="text-sm text-center  ">
              Don&apos;t have an account?{" "}
              <a className="underline" href="/sign-up">
                Sign up
              </a>
            </Span>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button className="w-full justify-center bg-white text-black hover:bg-neutral-200 rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-neutral-800 text-sm transition-all duration-200">
            {pathname === "/sign-up" ? "Create account" : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
