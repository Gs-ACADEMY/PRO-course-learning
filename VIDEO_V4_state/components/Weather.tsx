"use client";

import { useState } from "react";

// 第 3 章：読み込み中・気温・失敗を、別々の状態で持つ（1 つの型にまとめるのは講義で）。第 4 章：状態で出し分ける
type Forecast = {
  current: {
    time: string;
    temperature_2m: number;
  };
};

const url = "https://api.open-meteo.com/v1/forecast"
  + "?latitude=35.68&longitude=139.76"
  + "&current=temperature_2m";
// 失敗の実演（第 4 章）：上の url の forecast の後ろに "XXX" を足して壊す（url の最後に足しても 200 が返り、失敗にならない）

export default function Weather() {
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState<number | null>(null);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true); setError(false);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      const data: Forecast = await res.json();
      setTemp(data.current.temperature_2m);
    } catch { setError(true); }
    setLoading(false);
  }

  return (
    <section className="space-y-3 p-8">
      <button className="rounded border px-4 py-2" onClick={load}>今の気温を見る</button>
      {loading && <p>読み込み中…</p>}
      {error && <p className="font-bold text-rose-600">天気を取れませんでした</p>}
      {temp !== null && !loading && !error && (
        <div>
          <p className="text-4xl font-bold">{temp}℃</p>
          <p className="text-sm text-slate-500">Weather data by Open-Meteo.com</p>
        </div>
      )}
    </section>
  );
}
