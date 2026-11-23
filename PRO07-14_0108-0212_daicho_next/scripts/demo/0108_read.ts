// 1/8 スライド 14「デモ：AI のコードを 1 つ読む」の見本のコード
// 頼んだこと：見積中の案件を、更新が新しい順に一覧で
// 動かし方：npx tsx scripts/demo/0108_read.ts
import { prisma, resetCount, sqlCount } from "./prisma-with-log";

async function main() {
  resetCount();
  const projects = await prisma.project.findMany({
    where: { status: "ESTIMATING" }, // 絞り込み
    orderBy: { updatedAt: "desc" }, // 並べ替え
    include: { reports: true }, // 日報も一緒に
  });
  console.log(`\n走った SQL：${sqlCount()} 回（案件を取る 1 回 ＋ 日報をまとめて取る 1 回）`);
  console.log(`見積中の案件：${projects.length} 件（更新が新しい順）`);
  for (const p of projects) {
    console.log(`  No.${String(p.id).padStart(2, "0")} ${p.title}（更新 ${p.updatedAt.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}・日報 ${p.reports.length} 件）`);
  }
}

main().finally(() => prisma.$disconnect());
