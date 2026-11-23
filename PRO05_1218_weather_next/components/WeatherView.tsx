import { describeWeather, formatTime, type WeatherState } from "@/lib/weather";

type Props = {
  state: WeatherState;
  onRetry: () => void;
};

/** 表示の部品：status ごとに書き分ける */
export default function WeatherView({ state, onRetry }: Props) {
  switch (state.status) {
    case "loading":
      return <p className="py-6 text-center font-bold text-slate-500">天気を読み込み中…</p>;
    case "success": {
      const { current, daily } = state.data;
      const w = describeWeather(current.weather_code);
      return (
        <div className="flex items-center gap-5">
          <span className="text-6xl leading-none" aria-hidden="true">{w.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-500">今日の天気（東京）</p>
            <p className="mt-0.5 text-lg font-bold">
              {w.label}
              <span className="ml-3 text-4xl font-extrabold tracking-tight">{current.temperature_2m}℃</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              最高 <b className="text-rose-600">{daily.temperature_2m_max[0]}℃</b>
              <span className="mx-2 text-slate-300">／</span>
              最低 <b className="text-sky-700">{daily.temperature_2m_min[0]}℃</b>
              <span className="ml-3 text-xs text-slate-400">{formatTime(current.time)} 時点</span>
            </p>
          </div>
        </div>
      );
    }
    case "error":
      return (
        <div className="py-3 text-center">
          <p className="font-bold text-rose-600">天気を取れませんでした</p>
          <p className="mt-1 text-xs text-slate-500">{state.message}</p>
          <button onClick={onRetry} className="mt-3 rounded-xl bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700">
            もう一度
          </button>
        </div>
      );
  }
  const rest: never = state; // ここには来ないはず
  return rest;
}
