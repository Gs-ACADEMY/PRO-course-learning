import { auth } from "@/lib/auth";

/** 認証ライブラリから、今ログインしている人を取る（いなければ null） */
export async function getUser(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user ?? null;
}
