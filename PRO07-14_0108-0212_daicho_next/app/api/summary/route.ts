import { getUser } from "@/lib/session";
import { findLatestDayReports } from "@/lib/projects";
import { summarize } from "@/lib/ai";
import { log } from "@/lib/log";

const path = "/api/summary";

// 日報の要約の受け口（社長と事務の画面が呼ぶ）。失敗したら、記録に原因を残して 500 を返す
export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) {
    log("warn", { path, status: 401, userId: null, message: "not signed in" });
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }
  try {
    const reports = await findLatestDayReports();
    const lines = await summarize(reports.map((r) => `${r.project.title}：${r.note}`));
    log("info", { path, status: 200, userId: user.id, message: `summarized ${reports.length} reports` });
    return Response.json({ lines });
  } catch (e) {
    // 画面には理由を出さない。原因は記録（ログ）に全文で残す
    log("error", { path, status: 500, userId: user.id, message: e instanceof Error ? e.message : String(e) });
    return Response.json({ error: "要約を作れませんでした" }, { status: 500 });
  }
}
