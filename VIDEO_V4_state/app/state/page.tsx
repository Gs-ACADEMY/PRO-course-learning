"use client";

import { useState } from "react";

// 第 2・3 章：変数を変えても、画面は変わらない／状態を変えると、部品が動き直す
export default function StatePage() {
  let a = 0;
  const [b, setB] = useState(0);
  console.log("部品を動かした", { a, b });

  return (
    <main className="space-x-2 p-8">
      <button className="rounded border px-4 py-2" onClick={() => { a = a + 1; console.log("a は", a); }}>
        変数 a {a}
      </button>
      <button className="rounded border px-4 py-2" onClick={() => setB(b + 1)}>
        状態 b {b}
      </button>
    </main>
  );
}
