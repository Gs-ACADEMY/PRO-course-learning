import { getUser } from "@/lib/session";
import { getReport } from "@/lib/reports";
import { reportGuardOn } from "@/lib/permissions";
import { log } from "@/lib/log";

type Ctx = RouteContext<"/api/reports/[id]">;

// 日報を 1 件返す受け口（1/12 スライド 16 の実演）
export async function GET(req: Request, ctx: Ctx) {
  const user = await getUser(req); // 認証ライブラリから
  const { id } = await ctx.params;
  const path = `/api/reports/${id}`;
  if (!user) {
    log("warn", { path, status: 401, userId: null, message: "not signed in" });
    return new Response(null, { status: 401 });
  }
  const report = await getReport(Number(id));
  // 自分の日報でなければ、ここで止める（REPORT_GUARD="off" のときは止めない＝直す前の版）
  if (reportGuardOn() && report?.authorId !== user.id) {
    log("warn", { path, status: 403, userId: user.id, message: "not the author of this report" });
    return new Response(null, { status: 403 });
  }
  log("info", { path, status: 200, userId: user.id, message: report ? "report opened" : "report not found" });
  return Response.json(report);
}
