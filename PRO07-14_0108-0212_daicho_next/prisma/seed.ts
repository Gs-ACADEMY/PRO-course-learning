// 配布データ（1/8）：問い合わせ 30 件・案件 30 件・日報 50 件（中身は prisma/seed-data.ts）
// ＋ 見本のユーザー 5 人と、日報を書いた人（1/12）＋ 社員 7 人（1/26）
// 動かし方：npx prisma db seed（または npx tsx prisma/seed.ts）
import "dotenv/config";
import { prisma } from "../lib/prisma";
import { buildRows } from "./seed-data";
import { seedUsers } from "./seed-users";

// 社員（1/26 の依頼 4 で足した表）。担当の表（Assignment）は空のまま：移すのは 1/26 の SQL で
const staff: [string, string][] = [
  ["星凪", "社長"], ["森田", "営業"], ["小野", "事務"], ["谷口", "監督"], ["石井", "監督"], ["大川", "職人"], ["杉山", "職人"],
];

async function main() {
  const { inquiries, projects, reports } = buildRows();

  // 何度流しても同じ番号になるよう、表を空にして番号も 1 から振り直す
  await prisma.$executeRaw`TRUNCATE "Assignment", "Step", "Staff", "Report", "Project", "Inquiry" RESTART IDENTITY CASCADE`;

  // つながりの元から順に入れる（問い合わせ → 案件 → ユーザー → 日報）
  await prisma.inquiry.createMany({ data: inquiries });
  await prisma.project.createMany({ data: projects });
  await seedUsers();

  // 日報を書いた人＝その現場の監督。担当者の文字は谷口さんの書き方が 4 通りあるので、頭の文字で見分ける
  const users = await prisma.user.findMany({ select: { id: true, name: true } });
  const userId = (name: string) => users.find((u) => u.name === name)?.id ?? null;
  const assignee = new Map(projects.map((p) => [p.id, p.assignee]));
  const authorOf = (projectId: number) => {
    const a = assignee.get(projectId) ?? "";
    if (a.startsWith("谷口") || a.startsWith("たにぐち")) return userId("谷口");
    if (a.startsWith("石井")) return userId("石井");
    return null;
  };
  await prisma.report.createMany({ data: reports.map((r) => ({ ...r, authorId: authorOf(r.projectId) })) });
  await prisma.staff.createMany({ data: staff.map(([name, role]) => ({ name, role })) });

  // 番号は手で入れたので、次の番号を進めておく（このあと足す案件は 31 番から）
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Inquiry"', 'id'), (SELECT MAX(id) FROM "Inquiry"))`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Project"', 'id'), (SELECT MAX(id) FROM "Project"))`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Report"', 'id'), (SELECT MAX(id) FROM "Report"))`;
  const [p, r, q] = await Promise.all([prisma.project.count(), prisma.report.count(), prisma.inquiry.count()]);
  console.log(`案件 ${p} 件・日報 ${r} 件・問い合わせ ${q} 件・社員 ${staff.length} 人を入れました`);
}

main().finally(() => prisma.$disconnect());
