"use client";

import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  console.log("Counter を動かした", count);

  useEffect(() => {
    console.log("表示のあと：", localStorage.getItem("count"));
  }, []);

  function add() {
    const next = count + 1;
    setCount(next);
    localStorage.setItem("count", String(next));
  }

  return (
    <button className="mt-4 rounded border px-4 py-2" onClick={add}>
      押した回数 {count}
    </button>
  );
}
