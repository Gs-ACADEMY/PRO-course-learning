import { getUser } from "@/lib/session";
import { findReports } from "@/lib/projects";
import { monthlyWorkers, thisMonthLabel } from "@/lib/monthly";
import { log } from "@/lib/log";

const path = "/api/monthly";

// 月の作業人数の受け口（外側）：集めて・渡して・返す。?m=2027-01（なければ今月）
export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) {
    log("warn", { path, status: 401, userId: null, message: "not signed in" });
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }
  const m = new URL(req.url).searchParams.get("m") ?? thisMonthLabel();
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(m)) {
    log("warn", { path, status: 400, userId: user.id, message: `bad month: ${m}` });
    return Response.json({ error: "月は 2027-01 の形で送ってください" }, { status: 400 });
  }

  const rows = await findReports(m); // lib/projects.ts
  const total = monthlyWorkers(rows, m);
  log("info", { path, status: 200, userId: user.id, message: `${m}: ${total} workers` });
  return Response.json({ total });
}
