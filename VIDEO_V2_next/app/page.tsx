import Counter from "@/components/Counter";

export default function Home() {
  console.log("page.tsx を動かした");
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">なまえ のメモ</h1>
      <Counter />
    </main>
  );
}
