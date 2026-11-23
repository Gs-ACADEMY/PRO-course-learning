"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
      }}
      className="rounded-md px-3 py-1.5 text-sm font-bold text-slate-200 hover:bg-white/10"
    >
      ログアウト
    </button>
  );
}
