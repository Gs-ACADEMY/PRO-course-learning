"use client";

import { useEffect, useRef, useState } from "react";
import { callPlain, callWithCare, reason, SLOW_API, TRIES, WAIT } from "@/lib/demoApi";

/** 選べる API の動き（tools/slow-api/server.mjs と同じ） */
const MODES = [
  { path: "ok", label: "ふつう" },
  { path: "slow", label: "遅い（8 秒）" },
  { path: "fail", label: "落ちる（500）" },
  { path: "429", label: "断られる（429）" },
  { path: "flaky", label: "ときどき落ちる" },
];

/** ボタン 1 回分の記録 */
type Run = {
  n: number; // 何番目に押したか（URL の ?n= と同じ）
  care: boolean; // 対策ありで呼んだか
  start: number; // 押した時刻（ミリ秒）
  end: number | null; // 終わった時刻。待っている間は null
  ok: boolean;
  text: string; // 結果のことば
  tries: number; // 呼んだ回数（再試行を含む）
};

/** 対策のあり・なしを並べて比べる部品 */
export default function ApiDemo() {
  const [path, setPath] = useState("slow");
  const [runs, setRuns] = useState<Run[]>([]);
  const [now, setNow] = useState(0);
  const count = useRef(0);

  const careBusy = runs.some((r) => r.care && r.end === null);
  const waiting = runs.some((r) => r.end === null);

  // 待っている間だけ、0.1 秒ごとに時計を進める（経過の秒数を出すため）
  useEffect(() => {
    if (!waiting) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [waiting]);

  /** 記録を 1 つ足して、呼ぶ URL を返す */
  function begin(care: boolean): { n: number; url: string } {
    count.current += 1;
    const n = count.current;
    const start = Date.now();
    setNow(start);
    setRuns((rs) => [...rs, { n, care, start, end: null, ok: false, text: "待っている…", tries: 1 }]);
    // 押すたびに ?n= を変えて、別々の通信にする（同じ URL を同時に呼ぶと、ブラウザが 1 つずつ順に送るため）
    return { n, url: `${SLOW_API}/${path}?n=${n}` };
  }

  /** 記録を書き換える */
  function update(n: number, change: Partial<Run>) {
    setRuns((rs) => rs.map((r) => (r.n === n ? { ...r, ...change } : r)));
  }

  // 対策なし：押すたびに呼ぶ（連打もそのまま通る）
  async function runPlain() {
    const { n, url } = begin(false);
    try {
      const temp = await callPlain(url);
      update(n, { end: Date.now(), ok: true, text: `${temp}℃` });
    } catch (e) {
      update(n, { end: Date.now(), text: reason(e) });
    }
  }

  // 対策あり：タイムアウト・再試行。待っている間は呼ばない（回数を守る）
  async function runCare() {
    if (careBusy) return;
    const { n, url } = begin(true);
    let tries = 1;
    try {
      const temp = await callWithCare(
        url,
        (i) => {
          tries = i;
          update(n, { tries });
        },
        (i, why) => update(n, { text: `${i} 回目：${why} → ${WAIT / 1000} 秒待って、もう一度` }),
      );
      update(n, { end: Date.now(), ok: true, text: tries > 1 ? `${temp}℃（${tries} 回目で成功）` : `${temp}℃` });
    } catch (e) {
      update(n, { end: Date.now(), text: tries > 1 ? `${reason(e)}（${tries} 回目）` : reason(e) });
    }
  }

  function runBoth() {
    runPlain();
    runCare();
  }

  // 動きを変えたら、終わった記録は消す（待っている記録は残す）
  function choose(next: string) {
    setPath(next);
    setRuns((rs) => rs.filter((r) => r.end === null));
  }

  return (
    <div className="mt-6 space-y-5">
      {/* API の動きを選ぶ */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold text-slate-500">API の動き</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.path}
              onClick={() => choose(m.path)}
              aria-pressed={path === m.path}
              className={
                path === m.path
                  ? "rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white"
                  : "rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              }
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-3 break-all text-sm text-slate-600">
          呼ぶ URL：<span className="font-mono">{SLOW_API}/{path}?n=</span>（押した番号）
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={runBoth}
            disabled={careBusy}
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            両方を同時に呼ぶ
          </button>
          <button
            onClick={() => setRuns([])}
            disabled={waiting}
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            記録を消す
          </button>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <Panel
          title="対策なし"
          code="fetch(url)"
          lines={["遅いと、待ち続ける", "1 回落ちたら、それで終わり", "何度でも押せる（連打も通る）"]}
          runs={runs.filter((r) => !r.care)}
          now={now}
          disabled={false}
          onCall={runPlain}
        />
        <Panel
          title="対策あり"
          code="fetch(url, { signal: AbortSignal.timeout(5000) })"
          lines={[
            "タイムアウト：5 秒で打ち切る",
            `再試行：500 番台なら ${WAIT / 1000} 秒待って、${TRIES} 回まで`,
            "429（呼びすぎ）と打ち切りは、呼び直さない",
            "回数を守る：待っている間は押せない",
          ]}
          runs={runs.filter((r) => r.care)}
          now={now}
          disabled={careBusy}
          onCall={runCare}
        />
      </div>
    </div>
  );
}

type PanelProps = {
  title: string;
  code: string;
  lines: string[];
  runs: Run[];
  now: number;
  disabled: boolean;
  onCall: () => void;
};

/** 片側（対策なし・対策あり）の表示 */
function Panel({ title, code, lines, runs, now, disabled, onCall }: PanelProps) {
  const sent = runs.reduce((sum, r) => sum + r.tries, 0);
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" aria-label={title}>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">{code}</p>
      <ul className="mt-2 space-y-0.5 text-sm text-slate-600 sm:min-h-[5.5rem]">
        {lines.map((line) => (
          <li key={line}>・{line}</li>
        ))}
      </ul>
      <button
        onClick={onCall}
        disabled={disabled}
        className="mt-4 w-full rounded-xl bg-sky-600 px-5 py-3 text-base font-bold text-white hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {disabled ? "待っています…" : "呼ぶ"}
      </button>
      <p className="mt-3 text-sm font-bold text-slate-500">呼んだ回数：{sent}</p>
      <ol className="mt-2 space-y-2">
        {runs.map((r) => {
          const sec = (Math.max(0, (r.end ?? now) - r.start) / 1000).toFixed(1);
          const mark = r.end === null ? "待っている" : r.ok ? "成功" : "失敗";
          const color =
            r.end === null ? "bg-amber-50 ring-amber-200" : r.ok ? "bg-emerald-50 ring-emerald-200" : "bg-rose-50 ring-rose-200";
          return (
            <li key={r.n} className={`rounded-xl px-3 py-2 text-sm ring-1 ${color}`}>
              <span className="font-bold">{mark}</span>
              <span className="ml-2 font-mono">{sec} 秒</span>
              <span className="float-right font-mono text-xs text-slate-400">?n={r.n}</span>
              <p className="mt-0.5 break-words">{r.text}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
