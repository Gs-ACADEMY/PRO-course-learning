"use client";

import { useEffect, useState } from "react";

/** 日報の要約（受け口 /api/summary から読む。社長と事務の画面に出す） */
export default function SummaryCard() {
  const [lines, setLines] = useState<string[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/summary")
      .then(async (res) => {
        const data = (await res.json()) as { lines?: string[]; error?: string };
        if (!res.ok) throw new Error(`${data.error ?? "読めませんでした"}（${res.status}）`);
        setLines(data.lines ?? []);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <section className="mb-6 rounded-xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-2 text-sm font-bold text-slate-500">日報の要約（いちばん新しい日・5 行まで）</h2>
      {error && <p className="font-bold text-rose-600">{error}</p>}
      {!error && !lines && <p className="text-slate-500">読み込み中…</p>}
      {lines && lines.length === 0 && <p className="text-slate-500">日報はありません</p>}
      {lines && lines.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
