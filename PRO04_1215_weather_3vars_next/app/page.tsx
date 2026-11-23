import MemoBoard from "@/components/MemoBoard";
import WeatherCard from "@/components/WeatherCard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">メモ帳</h1>
      <p className="mt-1 text-sm text-slate-500">今日の天気を見ながら、メモを書けます。</p>
      <WeatherCard />
      <MemoBoard />
    </main>
  );
}
