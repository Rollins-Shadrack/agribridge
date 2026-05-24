"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { CardDescription } from "./ui/card";
import { Button } from "./ui/button";

type Props = {
  role: "buyer" | "farmer" | "admin";
};

export default function LoginButton({ role }: Props) {
  return (
    <Button
      variant="outline"
      className="flex items-center justify-center py-1 space-x-2 w-full"
      onClick={() => {
        authClient.signIn.social({
          provider: "google",
          callbackURL: `/login/callback?role=${role}`,
        });
      }}
    >
      <Image src="/google.png" width={20} height={20} alt="rollinscodes.com" />
      <CardDescription>Continue with Google</CardDescription>
    </Button>
  );
}
