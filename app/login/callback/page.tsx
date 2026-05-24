"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const role = params.get("role");

    const run = async () => {
      const session = await authClient.getSession();
      const user = session?.data?.user;

      if (!user || !role) {
        router.push("/login");
        return;
      }
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          role,
        }),
      });

      await new Promise((r) => setTimeout(r, 300));
      router.push("/?refresh=1");
    };

    run();
  }, []);

  return <div>Finalizing account...</div>;
}