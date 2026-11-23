"use client";

import { useState } from "react";

// 12/15 テーマⅠ「失敗に強く借りる」の実演と演習①：郵便番号から住所を出す（郵便番号検索API・zipcloud。鍵も登録もいらない）
// この API は、桁が違っても HTTP は 200 で返し、中身の status が 400 になる。ない番号は status 200 で results が null。
// だから res.ok だけでなく、中身の status と results も確かめる（10/25 に呼んで確かめた）
const URL = "https://zipcloud.ibsnet.co.jp/api/search";

type Address = { address1: string; address2: string; address3: string };

export default function ZipSearch() {
  const [zip, setZip] = useState(""); // 郵便番号は文字で持つ（数値にすると先頭の 0 が消える：0600000 → 600000）
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState<Address | null>(null);

  async function search() {
    setLoading(true); setError(""); setAddress(null);
    try {
      const res = await fetch(`${URL}?zipcode=${zip}`);
      const data = await res.json();
      if (!res.ok || data.status !== 200)
        setError(data.message ?? "取れませんでした");
      else if (!data.results) setError("見つかりませんでした");
      else setAddress(data.results[0]);
    } catch { setError("つながりませんでした"); }
    finally { setLoading(false); }
  }

  return (
    <section className="mt-8 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold">郵便番号から住所を出す</h2>
      <div className="flex gap-2">
        <input
          className="w-44 rounded-lg border border-slate-300 px-3 py-2 text-lg"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="1000001"
          inputMode="numeric"
          aria-label="郵便番号"
        />
        <button
          className="rounded-lg bg-sky-500 px-5 py-2 font-bold text-white disabled:opacity-50"
          onClick={search}
          disabled={loading}
        >
          探す
        </button>
      </div>
      {loading && <p className="text-slate-500">探しています…</p>}
      {error && <p className="font-bold text-rose-600">{error}</p>}
      {address && (
        <p className="text-2xl font-bold">
          {address.address1}{address.address2}{address.address3}
        </p>
      )}
    </section>
  );
}
