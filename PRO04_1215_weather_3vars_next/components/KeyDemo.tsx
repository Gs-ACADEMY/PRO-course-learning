"use client";

import { useState } from "react";
import { SLOW_API } from "@/lib/demoApi";

// 悪い例（実演用）：鍵をブラウザのコードに書いてしまった版。
// これはダミーの文字列で、本物の鍵ではない。本物の鍵は、ここに絶対に書かない
const API_KEY = "DUMMY-KEY-0000-not-a-real-key";

/** 鍵つきで API を呼ぶ部品（鍵が URL に入るので、Network の行にも出る） */
export default function KeyDemo() {
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState<number | null>(null);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true); setError(false);
    try {
      const res = await fetch(`${SLOW_API}/ok?key=${API_KEY}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setTemp(data.current.temperature_2m);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
      <button
        onClick={load}
        disabled={loading}
        className="rounded-xl bg-sky-600 px-6 py-3 text-base font-bold text-white hover:bg-sky-700 active:bg-sky-800 disabled:bg-slate-300"
      >
        鍵つきで呼ぶ
      </button>
      {loading && <p className="mt-4 font-bold text-slate-500">読み込み中…</p>}
      {!loading && error && (
        <p className="mt-4 font-bold text-rose-600">取れませんでした（npm run slow-api は動いていますか？）</p>
      )}
      {!loading && !error && temp !== null && (
        <div className="mt-4">
          <p className="text-sm font-bold text-slate-500">今の気温</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight">{temp}℃</p>
          <p className="mt-2 text-xs text-slate-400">画面には、鍵は出ていません</p>
        </div>
      )}
    </section>
  );
}
