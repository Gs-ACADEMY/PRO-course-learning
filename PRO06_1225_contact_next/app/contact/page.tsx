"use client";

import Link from "next/link";
import { useState } from "react";

/** 送ったあとに出すお知らせ（raw は受け口の返事そのもの） */
type Notice = { ok: boolean; text: string; raw: string };

/** 問い合わせのページ（画面）。送り先は自分の受け口（app/api/contact/route.ts） */
export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false); // 送っている間は true（ボタンを止める）
  const [notice, setNotice] = useState<Notice | null>(null);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const result = await res.json();
      const raw = `${res.status} ${JSON.stringify(result)}`;
      if (res.ok) {
        setNotice({ ok: true, text: "送りました。ありがとうございます", raw });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setNotice({ ok: false, text: result.error ?? "送れませんでした", raw });
      }
    } catch {
      setNotice({ ok: false, text: "送れませんでした（受け口から返事がありません）", raw: "" });
    } finally {
      setSending(false);
    }
  }

  const field =
    "mt-1 block w-full rounded-xl bg-slate-50 px-4 py-3 text-base outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-sky-400";

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm font-bold text-sky-700 hover:underline">
        ← メモ帳にもどる
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-wide sm:text-3xl">お問い合わせ</h1>
      <p className="mt-1 text-sm text-slate-500">ご相談は、このフォームから送ってください。</p>

      {/* 画面のチェック：required（空のままでは送れない）。親切のためのもの */}
      <form onSubmit={send} className="mt-6 space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="block">
          <span className="text-sm font-bold text-slate-600">名前</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={field} />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-600">メール</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-600">相談したいこと</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className={field} />
        </label>
        <button
          type="submit"
          disabled={sending}
          className="rounded-xl bg-sky-600 px-6 py-3 text-base font-bold text-white hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {sending ? "送っています…" : "送る"}
        </button>
      </form>

      {notice && (
        <div
          role="status"
          className={`mt-5 rounded-2xl px-5 py-4 ring-1 ${notice.ok ? "bg-emerald-50 ring-emerald-200" : "bg-rose-50 ring-rose-200"}`}
        >
          <p className={`font-bold ${notice.ok ? "text-emerald-700" : "text-rose-700"}`}>{notice.text}</p>
          {notice.raw && <p className="mt-1 font-mono text-xs text-slate-500">返事：{notice.raw}</p>}
        </div>
      )}
    </main>
  );
}
