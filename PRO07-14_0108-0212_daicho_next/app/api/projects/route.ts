import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseStatus } from "@/lib/filter";
import { amountGuardOn, canSeeAmount } from "@/lib/permissions";
import { findProjects } from "@/lib/projects";
import { log } from "@/lib/log";

const path = "/api/projects";

// 案件の一覧の受け口（一覧の画面がここを呼ぶ）。?status=ESTIMATING で状態を絞り込む
export async function GET(req: Request) {
  // 1. 誰か（認証）：ログインしていなければ 401
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    log("warn", { path, status: 401, userId: null, message: "not signed in" });
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }

  // 2. 何をしてよいか（権限）：金額を見てよい役割でなければ、金額を取り出さずに返す
  const showAmount = !amountGuardOn() || canSeeAmount(session.user.role);
  const status = parseStatus(new URL(req.url).searchParams.get("status") ?? undefined);
  const projects = await findProjects({ status, withAmount: showAmount });
  log("info", { path, status: 200, userId: session.user.id, message: `${projects.length} projects${showAmount ? "" : " (no amount)"}` });
  return Response.json(projects);
}
