// 実演用：走った SQL を数えて、ターミナルに出す Prisma
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../lib/generated/prisma/client";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  log: [{ emit: "event", level: "query" }],
});

// 読みやすくするため、FROM・WHERE・ORDER BY の前で改行する（列の並びは長いので短くする）
function tidy(sql: string) {
  return sql
    .replace(/\s+/g, " ")
    .replace(/^SELECT .*? FROM/, "SELECT （列が並ぶ） FROM")
    .replace(/ (FROM|WHERE|ORDER BY|OFFSET|LIMIT) /g, "\n         $1 ");
}

let count = 0;
let show = true;
prisma.$on("query", (e) => {
  count++;
  if (show) console.log(`  SQL ${count}: ${tidy(e.query)}`);
});

/** ここから数え直す。quiet にすると SQL の中身は出さず、回数だけ数える */
export function resetCount(opts: { quiet?: boolean } = {}) {
  count = 0;
  show = !opts.quiet;
}
export const sqlCount = () => count;
