// 1/8 スライド 15「深掘り：ORM の裏で動く SQL」の実演
// 1 件ずつ取る（N+1）と、まとめて取る（include）で、走る SQL の回数を比べる
// 動かし方：npx tsx scripts/demo/0108_n_plus_1.ts（SQL を 1 本ずつ見たいときは --verbose）
import { prisma, resetCount, sqlCount } from "./prisma-with-log";

const quiet = !process.argv.includes("--verbose");

async function oneByOne() {
  const list = await prisma.project.findMany();
  for (const p of list) {
    const reports = await prisma.report.findMany({
      where: { projectId: p.id },
    });
    void reports;
  }
  return list.length;
}

async function together() {
  const list = await prisma.project.findMany({
    include: { reports: true },
  });
  return list.length;
}

async function main() {
  console.log("1 件ずつ取る（N+1）");
  resetCount({ quiet });
  let t = performance.now();
  const n = await oneByOne();
  console.log(`  案件 ${n} 件 → SQL ${sqlCount()} 回（1 + ${n}）・${Math.round(performance.now() - t)} ms\n`);

  console.log("まとめて取る（include）");
  resetCount({ quiet });
  t = performance.now();
  const m = await together();
  console.log(`  案件 ${m} 件 → SQL ${sqlCount()} 回・${Math.round(performance.now() - t)} ms`);
}

main().finally(() => prisma.$disconnect());
