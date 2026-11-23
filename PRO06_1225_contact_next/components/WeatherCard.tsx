"use client";

import { useEffect, useState } from "react";
import { fetchForecast, type WeatherState } from "@/lib/weather";
import WeatherView from "./WeatherView";

/** 天気を読み、結果を状態に入れる */
async function load(setState: (s: WeatherState) => void) {
  try {
    const data = await fetchForecast();
    setState({ status: "success", data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "原因が分かりません";
    setState({ status: "error", message });
  }
}

/** 今日の天気のカード（状態を持ち、表示は WeatherView に任せる） */
export default function WeatherCard() {
  const [state, setState] = useState<WeatherState>({ status: "loading" });

  // 最初に 1 回：画面を開いたら読む
  useEffect(() => {
    load(setState);
  }, []);

  function retry() {
    setState({ status: "loading" });
    load(setState);
  }

  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <WeatherView state={state} onRetry={retry} />
      <p className="mt-3 border-t border-slate-100 pt-2 text-right text-sm text-slate-500">
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
          Weather data by Open-Meteo.com
        </a>
      </p>
    </section>
  );
}
