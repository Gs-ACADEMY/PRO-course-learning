// 配布データ（prisma/seed-data.ts）から、data/ の CSV 3 つを作り直す
// 動かし方：npm run data:csv（このフォルダーの一番上で）
import { mkdirSync, writeFileSync } from "node:fs";
import { buildRows } from "../prisma/seed-data";
import { STATUS_LABEL } from "../lib/status";

type Value = string | number | null;

/** 日本時間の日時の文字（例：2027-01-07T17:20:00+09:00） */
function jst(d: Date): string {
  return new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 19) + "+09:00";
}

/** CSV の 1 つの値。空は空のまま。カンマ・"・改行を含むときだけ "" で囲む */
function cell(v: Value): string {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

/** 1 行目に列の名前、2 行目から 1 件ずつ（UTF-8） */
function writeCsv(file: string, header: string[], rows: Value[][]) {
  const lines = [header, ...rows].map((row) => row.map(cell).join(","));
  writeFileSync(file, lines.join("\n") + "\n", "utf8");
  console.log(`${file}：${rows.length} 件`);
}

const { inquiries, projects, reports } = buildRows();
mkdirSync("data", { recursive: true });

writeCsv(
  "data/projects.csv",
  ["id", "title", "status", "status_label", "amount", "assignee", "inquiry_id", "updated_at"],
  projects.map((p) => [p.id, p.title, p.status, STATUS_LABEL[p.status], p.amount, p.assignee, p.inquiryId, jst(p.updatedAt)]),
);
writeCsv(
  "data/reports.csv",
  ["id", "project_id", "date", "workers", "note"],
  reports.map((r) => [r.id, r.projectId, jst(r.date), r.workers, r.note]),
);
writeCsv(
  "data/inquiries.csv",
  ["id", "name", "body", "created_at"],
  inquiries.map((q) => [q.id, q.name, q.body, jst(q.createdAt)]),
);
