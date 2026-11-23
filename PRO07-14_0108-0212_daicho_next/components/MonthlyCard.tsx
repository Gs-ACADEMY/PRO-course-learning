"use client";

import { useEffect, useState } from "react";

/** 月の作業人数（受け口 /api/monthly から読む） */
export default function MonthlyCard({ month }: { month: string }) {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/monthly?m=${month}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<{ total: number }>;
      })
      .then((data) => setTotal(data.total))
      .catch((e: Error) => setError(`読めませんでした（${e.message}）`));
  }, [month]);

  return (
    <div>
      <p className="text-sm font-bold text-slate-500">{month} の作業人数</p>
      <p className="text-2xl font-bold">
        {error ? <span className="text-base text-rose-600">{error}</span> : <>延べ <span className="tabular-nums">{total ?? "…"}</span> 人</>}
      </p>
    </div>
  );
}
