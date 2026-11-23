"use client";

import { useEffect, useState } from "react";
import { STATUS_LABEL } from "@/lib/status";
import type { Status } from "@/lib/generated/prisma/enums";

type Row = {
  id: number;
  title: string;
  status: Status;
  amount?: number | null;
  assignee: string | null;
  updatedAt: string;
};

type Props = { status: Status | undefined; canSeeAmount: boolean };

const yen = (n: number | null | undefined) => (n == null ? "—" : `${n.toLocaleString("ja-JP")} 円`);
// サーバーやブラウザの時計がどこの時間でも、日本時間で出す（例：2027/1/7 17:20）
const when = (iso: string) =>
  new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** 案件の一覧（受け口 /api/projects から読む。並べる順は受け口が返した順のまま） */
export default function ProjectTable({ status, canSeeAmount }: Props) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  // 「金額を更新」：新しい金額を聞いて、受け口に送る（止めるかどうかは受け口が決める）
  async function updateAmount(p: Row) {
    const input = window.prompt(`No.${String(p.id).padStart(2, "0")} ${p.title} の新しい見積金額（円）`, p.amount == null ? "" : String(p.amount));
    if (input === null) return;
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(input) }),
    });
    const data = (await res.json()) as { amount?: number; error?: string };
    if (!res.ok) {
      setMessage(`金額を更新できませんでした：${data.error}（${res.status}）`);
      return;
    }
    setMessage(`No.${String(p.id).padStart(2, "0")} の金額を ${yen(data.amount)} にしました`);
    setReload((n) => n + 1);
  }

  useEffect(() => {
    fetch(status ? `/api/projects?status=${status}` : "/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<Row[]>;
      })
      .then(setRows)
      .catch((e: Error) => setError(`一覧を読めませんでした（${e.message}）`));
  }, [status, reload]);

  if (error) return <p className="font-bold text-rose-600">{error}</p>;
  if (!rows) return <p className="text-slate-500">読み込み中…</p>;
  if (rows.length === 0) return <p className="text-slate-500">この状態の案件はありません</p>;

  return (
    <>
      <div className="mb-2 flex items-center gap-4 text-sm">
        {message && <p className="font-bold text-slate-700">{message}</p>}
        <p className="ml-auto text-slate-600">
          <span className="text-lg font-bold text-slate-900">{rows.length}</span> 件
        </p>
      </div>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">件名</th>
              <th className="px-4 py-3">状態</th>
              <th className="px-4 py-3">担当者</th>
              {canSeeAmount && <th className="px-4 py-3 text-right">見積金額</th>}
              <th className="px-4 py-3">更新日時</th>
              <th className="px-4 py-3"><span className="sr-only">操作</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5 text-slate-500">{String(p.id).padStart(2, "0")}</td>
                <td className="px-4 py-2.5 font-bold">{p.title}</td>
                <td className="px-4 py-2.5">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">{STATUS_LABEL[p.status]}</span>
                </td>
                <td className="px-4 py-2.5">{p.assignee}</td>
                {canSeeAmount && <td className="px-4 py-2.5 text-right tabular-nums">{yen(p.amount)}</td>}
                <td className="px-4 py-2.5 text-slate-500">{when(p.updatedAt)}</td>
                <td className="px-4 py-2.5 text-right">
                  {/* 金額を見られない役割には、ボタンを隠す（画面の側の分け方。止めるのは受け口） */}
                  <button type="button" hidden={!canSeeAmount} onClick={() => updateAmount(p)}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50">
                    金額を更新
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
