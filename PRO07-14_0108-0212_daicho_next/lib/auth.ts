import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

// 認証は自作しない：パスワードのハッシュ、ログインの印（セッション）、期限切れはライブラリに任せる
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      // 役割：president（社長）／sales（営業）／office（事務）／supervisor（監督）
      role: { type: "string", required: false, defaultValue: "supervisor", input: false },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
