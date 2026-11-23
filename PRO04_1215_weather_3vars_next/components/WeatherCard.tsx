"use client";

import { useEffect, useState } from "react";

// 呼ぶ URL（スライド 6 と同じ）：東京の、今の気温
const OPEN_METEO = "https://api.open-meteo.com/v1/forecast"
  + "?latitude=35.68&longitude=139.76"
  + "&current=temperature_2m";

// 予備：.env.local に NEXT_PUBLIC_WEATHER_URL を書くと、そちらを呼ぶ（ふだんは書かない）
const url = process.env.NEXT_PUBLIC_WEATHER_URL || OPEN_METEO;
// 失敗の実演：上の行を // で止めて、下の行の // を外す（URL の最後に XXX を付けて壊す）
// const url = OPEN_METEO + "XXX";

/** 今の気温のカード（状態は 3 つの変数で持つ） */
export default function WeatherCard() {
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState<number | null>(null);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true); setError(false);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setTemp(data.current.temperature_2m);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // 最初に 1 回：画面を開いたら読む
  useEffect(() => {
    // 既定の lint はここを error にする（react-hooks/set-state-in-effect）。
    // 12/8 の「最初に 1 回読む」形のまま使うため、この 1 行だけ外している
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      {/* 読み込み中 */}
      {loading && <p className="py-6 text-center font-bold text-slate-500">天気を読み込み中…</p>}

      {/* 失敗 */}
      {!loading && error && (
        <div className="py-3 text-center">
          <p className="font-bold text-rose-600">天気を取れませんでした</p>
          <button
            onClick={load}
            className="mt-3 rounded-xl bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
          >
            もう一度
          </button>
        </div>
      )}

      {/* 成功（出典の表示も入れる） */}
      {!loading && !error && (
        <div className="text-center">
          <p className="text-sm font-bold text-slate-500">今の気温</p>
          <p className="mt-1 text-5xl font-extrabold tracking-tight">{temp}℃</p>
          <p className="mt-3 text-sm text-slate-500">
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
              Weather data by Open-Meteo.com
            </a>
          </p>
        </div>
      )}
    </section>
  );
}
