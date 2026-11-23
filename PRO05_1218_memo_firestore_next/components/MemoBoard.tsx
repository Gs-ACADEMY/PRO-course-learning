"use client";

import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import MemoForm from "./MemoForm";
import MemoList from "./MemoList";
import type { Memo } from "./types";

/** 状態（メモの配列）を持ち、入力と一覧に配る部品。保存先は Firestore の memos（12/15 版の localStorage の代わり） */
export default function MemoBoard() {
  const [memos, setMemos] = useState<Memo[]>([]);

  // 開いているあいだ、Firestore の memos を見張る。ほかの窓や端末で足したメモも、ここに届く
  useEffect(() => {
    const q = query(collection(db, "memos"), orderBy("createdAt"));
    const stop = onSnapshot(q, (snap) => {
      setMemos(snap.docs.map((doc) => ({ id: doc.id, text: doc.get("text"), createdAt: doc.get("createdAt") })));
    });
    return stop; // 画面を閉じたら、見張りをやめる
  }, []);

  // 足すとき：Firestore に書くだけ。画面（状態）は、上の見張りが変える
  async function add(memo: Memo) {
    await addDoc(collection(db, "memos"), { text: memo.text, createdAt: memo.createdAt });
  }

  return (
    <section className="mt-6 space-y-5">
      <MemoForm onAdd={add} />
      <MemoList memos={memos} />
    </section>
  );
}
