import { STATUS_LABEL } from "@/lib/status";
import type { Project } from "@/lib/generated/prisma/client";

type Props = { projects: Project[] };

const yen = (n: number | null) => (n == null ? "—" : `${n.toLocaleString("ja-JP")} 円`);
// サーバーの時計がどこの時間でも、日本時間で出す（例：2027/1/7 17:20）
const when = (d: Date) =>
  d.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** 案件の一覧の表（並べる順は、渡された順のまま） */
export default function ProjectTable({ projects }: Props) {
  if (projects.length === 0) return <p className="text-slate-500">この状態の案件はありません</p>;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs text-slate-500">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">件名</th>
            <th className="px-4 py-3">状態</th>
            <th className="px-4 py-3">担当者</th>
            <th className="px-4 py-3 text-right">見積金額</th>
            <th className="px-4 py-3">更新日時</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="border-t border-slate-100">
              <td className="px-4 py-2.5 text-slate-500">{String(p.id).padStart(2, "0")}</td>
              <td className="px-4 py-2.5 font-bold">{p.title}</td>
              <td className="px-4 py-2.5">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">{STATUS_LABEL[p.status]}</span>
              </td>
              <td className="px-4 py-2.5">{p.assignee}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{yen(p.amount)}</td>
              <td className="px-4 py-2.5 text-slate-500">{when(p.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
