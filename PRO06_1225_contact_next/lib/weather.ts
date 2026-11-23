// お天気（Open-Meteo）の呼び出しと、その型

/** 東京の今の天気と、今日の最高・最低 */
export const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=35.68&longitude=139.76" +
  "&current=temperature_2m,weather_code" +
  "&daily=temperature_2m_max,temperature_2m_min" +
  "&timezone=Asia%2FTokyo&forecast_days=1";

/** 返ってくる JSON のうち、画面で使う所だけの型 */
export type Forecast = {
  current: {
    time: string; // "2026-12-18T19:00"
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

/** 読み込み中・成功・失敗の 3 つの状態を 1 つの型に（| は「または」） */
export type WeatherState =
  | { status: "loading" }
  | { status: "success"; data: Forecast }
  | { status: "error"; message: string };

/** 天気を呼ぶ。返り値は Forecast */
export async function fetchForecast(): Promise<Forecast> {
  const res = await fetch(FORECAST_URL);
  if (!res.ok) throw new Error(`天気のサービスが ${res.status} を返しました`);
  const data: Forecast = await res.json();
  return data;
}

/** 天気の番号（WMO）を、ことばと絵に */
export function describeWeather(code: number): { label: string; icon: string } {
  if (code === 0) return { label: "快晴", icon: "☀️" };
  if (code <= 2) return { label: "晴れ", icon: "🌤️" };
  if (code === 3) return { label: "くもり", icon: "☁️" };
  if (code === 45 || code === 48) return { label: "霧", icon: "🌫️" };
  if (code >= 51 && code <= 67) return { label: "雨", icon: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "雪", icon: "❄️" };
  if (code >= 80 && code <= 82) return { label: "にわか雨", icon: "🌦️" };
  if (code === 85 || code === 86) return { label: "にわか雪", icon: "🌨️" };
  if (code >= 95) return { label: "雷雨", icon: "⛈️" };
  return { label: "不明", icon: "❔" };
}

/** "2026-12-18T19:00" → "12/18 19:00" */
export function formatTime(time: string): string {
  const [date, hm] = time.split("T");
  const [, m, d] = date.split("-");
  return `${Number(m)}/${Number(d)} ${hm}`;
}
