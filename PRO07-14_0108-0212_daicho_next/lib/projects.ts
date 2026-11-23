import { prisma } from "@/lib/prisma";
import type { Status } from "@/lib/generated/prisma/enums";

// データの置き場：データベースを読み書きする所は、ここにまとめる（1/19）

/** 案件の一覧（状態で絞り込み・更新が新しい順）。withAmount が false なら金額を取り出さない */
export async function findProjects({ status, withAmount }: { status?: Status; withAmount: boolean }) {
  return prisma.project.findMany({
    where: { status }, // 絞り込み
    orderBy: { updatedAt: "desc" }, // 並べ替え（更新が新しい順）
    select: { id: true, title: true, status: true, amount: withAmount, assignee: true, updatedAt: true },
  });
}

/** その月（"2027-01"・日本時間）の日報。集計に渡す日付と人数だけを読む */
export async function findReports(m: string) {
  const [year, month] = m.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1) - 9 * 3600 * 1000); // 日本時間の月初め 0:00
  const end = new Date(Date.UTC(year, month, 1) - 9 * 3600 * 1000); // 次の月の初め 0:00
  return prisma.report.findMany({
    where: { date: { gte: start, lt: end } },
    select: { date: true, workers: true },
  });
}

/** いちばん新しい日の日報（要約に渡す。どの案件の日報かも一緒に） */
export async function findLatestDayReports() {
  const latest = await prisma.report.findFirst({ orderBy: { date: "desc" }, select: { date: true } });
  if (!latest) return [];
  return prisma.report.findMany({
    where: { date: latest.date },
    orderBy: { id: "asc" },
    select: { note: true, project: { select: { title: true } } },
  });
}
