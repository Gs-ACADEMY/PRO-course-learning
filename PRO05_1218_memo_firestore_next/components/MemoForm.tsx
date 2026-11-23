"use client";

import { useState } from "react";
import type { Memo } from "./types";

type Props = {
  onAdd: (memo: Memo) => void;
};

/** 1　入力：文字を入れて、メモを足す部品 */
export default function MemoForm({ onAdd }: Props) {
  const [text, setText] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAdd({ id: crypto.randomUUID(), text: value, createdAt: new Date().toISOString() });
    setText("");
  }

  return (
    <form onSubmit={submit} className="flex gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="メモを書く…"
        aria-label="メモ"
        className="min-w-0 flex-1 rounded-xl bg-slate-50 px-4 py-3 text-base outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-sky-400"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-sky-600 px-5 py-3 text-base font-bold text-white hover:bg-sky-700 active:bg-sky-800"
      >
        足す
      </button>
    </form>
  );
}
