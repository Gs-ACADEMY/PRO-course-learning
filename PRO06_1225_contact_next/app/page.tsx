import Link from "next/link";
import MemoBoard from "@/components/MemoBoard";
import WeatherCard from "@/components/WeatherCard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">メモ帳</h1>
        <Link href="/contact" className="text-sm font-bold text-sky-700 hover:underline">
          お問い合わせ
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500">今日の天気を見ながら、メモを書けます。</p>
      <WeatherCard />
      <MemoBoard />
    </main>
  );
}
