import MemoBoard from "@/components/MemoBoard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">メモ帳</h1>
      <p className="mt-1 text-sm text-slate-500">書いて「足す」を押すと、下に並びます。ほかの窓や端末にも、すぐ出ます。</p>
      <MemoBoard />
    </main>
  );
}
