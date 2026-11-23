import type { Metadata } from "next";
import Link from "next/link";
import ApiDemo from "@/components/ApiDemo";

export const metadata: Metadata = {
  title: "対策のあり・なし（実演）",
};

/** スライド 10 の実演：わざと遅い・落ちる API で、対策のあり・なしを比べる */
export default function ApiDemoPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm text-sky-700 hover:underline">
        ← メモ帳に戻る
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-wide sm:text-3xl">対策のあり・なしを比べる</h1>
      <p className="mt-1 text-sm text-slate-500">
        わざと遅い・落ちる API を、2 つのやり方で呼びます。先に、別のターミナルで npm run slow-api を動かしておきます。
      </p>
      <ApiDemo />
      <p className="mt-6 text-right text-xs text-slate-400">
        気温の値：
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
          Weather data by Open-Meteo.com
        </a>
        （10/11 08:30 に取った返り値を、実演用のサーバーが返しています）
      </p>
    </main>
  );
}
