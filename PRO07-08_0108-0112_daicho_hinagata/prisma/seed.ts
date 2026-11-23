// 配布データ（1/8）：問い合わせ 30 件・案件 30 件・日報 50 件（中身は prisma/seed-data.ts）
// 動かし方：npx prisma db seed（または npx tsx prisma/seed.ts）
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { buildRows } from "./seed-data";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const { inquiries, projects, reports } = buildRows();

  // 何度流しても同じ番号になるよう、表を空にして番号も 1 から振り直す
  await prisma.$executeRawUnsafe('TRUNCATE "Report", "Project", "Inquiry" RESTART IDENTITY CASCADE');

  // つながりの元から順に入れる（問い合わせ → 案件 → 日報）
  await prisma.inquiry.createMany({ data: inquiries });
  await prisma.project.createMany({ data: projects });
  await prisma.report.createMany({ data: reports });

  // 番号は手で入れたので、次の番号を進めておく（このあと足す案件は 31 番から）
  for (const table of ["Inquiry", "Project", "Report"]) {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), (SELECT MAX(id) FROM "${table}"))`);
  }
  const [p, r, q] = await Promise.all([prisma.project.count(), prisma.report.count(), prisma.inquiry.count()]);
  console.log(`案件 ${p} 件・日報 ${r} 件・問い合わせ ${q} 件を入れました`);
}

main().finally(() => prisma.$disconnect());
