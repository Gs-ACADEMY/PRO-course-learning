import Weather from "@/components/Weather";

export default function WeatherPage() {
  return (
    <main className="mx-auto w-full max-w-2xl">
      <h1 className="px-8 pt-8 text-2xl font-bold">お天気</h1>
      <Weather />
    </main>
  );
}
