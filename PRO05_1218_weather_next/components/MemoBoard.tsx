"use client";

import { useEffect, useState } from "react";
import MemoForm from "./MemoForm";
import MemoList from "./MemoList";
import type { Memo } from "./types";

const KEY = "memos";

/** 状態（メモの配列）を持ち、入力と一覧に配る部品 */
export default function MemoBoard() {
  const [memos, setMemos] = useState<Memo[]>([]);

  // 最初に 1 回：端末から読む（保存 → 状態）
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    // 既定の lint はここを error にする（react-hooks/set-state-in-effect）。
    // 12/8 の「最初に 1 回読む」形のまま使うため、この 1 行だけ外している
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setMemos(JSON.parse(saved));
  }, []);

  // 足すとき：状態を変えて、保存も呼ぶ（状態 → 保存）
  function add(memo: Memo) {
    const next = [...memos, memo];
    setMemos(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return (
    <section className="mt-6 space-y-5">
      <MemoForm onAdd={add} />
      <MemoList memos={memos} />
    </section>
  );
}
