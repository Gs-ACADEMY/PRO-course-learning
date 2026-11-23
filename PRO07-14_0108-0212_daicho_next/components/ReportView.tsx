"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  id: number;
  date: string;
  workers: number;
  note: string;
  project: { id: number; title: string };
};

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "numeric", day: "numeric", weekday: "short" });

/** 日報 1 件の表示（受け口の返事をそのまま出す。止められたら番号を出す） */
export default function ReportView({ id }: { id: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then(async (res) => {
        if (res.status === 401) throw new Error("ログインしてください（401）");
        if (res.status === 403) throw new Error("この日報は開けません（403）");
        if (!res.ok) throw new Error(`読めませんでした（${res.status}）`);
        const data = (await res.json()) as Report | null;
        if (!data) throw new Error("この番号の日報はありません");
        setReport(data);
      })
      .catch((e: Error) => setMessage(e.message));
  }, [id]);

  if (message) return <p className="rounded-lg bg-rose-50 px-4 py-3 font-bold text-rose-700">{message}</p>;
  if (!report) return <p className="text-slate-500">読み込み中…</p>;

  return (
    <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <dt className="font-bold text-slate-500">案件</dt>
      <dd>
        No.{String(report.project.id).padStart(2, "0")} {report.project.title}
      </dd>
      <dt className="font-bold text-slate-500">作業した日</dt>
      <dd>{day(report.date)}</dd>
      <dt className="font-bold text-slate-500">人数</dt>
      <dd>{report.workers} 人</dd>
      <dt className="font-bold text-slate-500">内容</dt>
      <dd>{report.note}</dd>
      <dd className="col-span-2 pt-2 text-sm">
        <Link href="/projects" className="text-sky-700 underline">案件の一覧へ</Link>
      </dd>
    </dl>
  );
}
