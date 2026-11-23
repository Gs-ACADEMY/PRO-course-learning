import ZipSearch from "@/components/ZipSearch";

export default function ZipPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">郵便番号</h1>
      <ZipSearch />
    </main>
  );
}
