import type { Metadata } from "next";
import Link from "next/link";
import KeyDemo from "@/components/KeyDemo";

export const metadata: Metadata = {
  title: "鍵が見える（実演）",
};

/** スライド 15 の実演：ブラウザに届いたコードの中に、鍵が見える */
export default function KeyDemoPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm text-sky-700 hover:underline">
        ← メモ帳に戻る
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-wide sm:text-3xl">ブラウザに届いた鍵を探す</h1>
      <p className="mt-1 text-sm text-slate-500">先に、別のターミナルで npm run slow-api を動かしておきます。</p>

      <div className="mt-6 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
        <p className="font-bold text-rose-700">悪い例です</p>
        <p className="mt-1 text-sm leading-relaxed">
          このページの JS には、鍵（ダミーの文字列。本物ではありません）を書いてあります。鍵をブラウザのコードに書くと、ページを開いた全員に配ることになります。
        </p>
      </div>

      <ol className="mt-5 space-y-2 text-sm leading-relaxed">
        <li>1　開発者ツール → Sources（ソース）を開く</li>
        <li>2　全体を検索（Ctrl + Shift + F、Mac は ⌘ + ⌥ + F）で、鍵らしい文字列を探す</li>
        <li>3　Network を開いてから下のボタンを押し、行の URL を見る</li>
      </ol>

      <KeyDemo />

      <p className="mt-6 text-right text-xs text-slate-400">
        気温の値：
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
          Weather data by Open-Meteo.com
        </a>
        （実演用のサーバーが返しています）
      </p>
    </main>
  );
}
