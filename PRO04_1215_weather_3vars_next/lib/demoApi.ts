// スライド 10 の実演：わざと遅い・落ちる API を、対策なし・対策ありで呼ぶ

/** 実演用のサーバー（npm run slow-api）の場所 */
export const SLOW_API = "http://localhost:4010";

export const TRIES = 3; // 再試行：全部で 3 回まで（回数を決める）
export const WAIT = 1000; // 呼び直す前に、少し待つ（1 秒）

/** 対策なし：fetch だけ。遅ければ待ち続け、1 回落ちたら終わり */
export async function callPlain(url: string): Promise<number> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json();
  return data.current.temperature_2m;
}

/** 対策あり：5 秒で打ち切る。相手の不調（500 番台）なら、少し待って決めた回数まで呼び直す */
export async function callWithCare(
  url: string,
  onTry: (i: number) => void, // i 回目を呼ぶとき
  onRetry: (i: number, why: string) => void, // i 回目が落ちて、呼び直すとき
): Promise<number> {
  for (let i = 1; i <= TRIES; i++) {
    onTry(i);
    try {
      // 5 秒で打ち切る（タイムアウト）
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      return data.current.temperature_2m;
    } catch (e) {
      // 呼び直すのは 500 番台だけ。打ち切り・429・最後の 1 回は、ここで止める
      if (!isServerError(e) || i === TRIES) throw e;
      onRetry(i, reason(e));
      await wait(WAIT);
    }
  }
  throw new Error("ここには来ない"); // ループの中で、必ず返すか投げる
}

/** 相手の不調（500 番台）か */
function isServerError(e: unknown): boolean {
  return e instanceof Error && Number(e.message) >= 500;
}

/** 決めた時間だけ待つ */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 失敗の理由を、短いことばに */
export function reason(e: unknown): string {
  if (e instanceof DOMException && e.name === "TimeoutError") return "5 秒で打ち切り";
  if (e instanceof TypeError) return "つながらない（npm run slow-api は動いていますか？）";
  if (!(e instanceof Error)) return "原因が分からない";
  if (e.message === "429") return "429（呼びすぎで断られた）";
  if (isServerError(e)) return `${e.message}（相手の不調）`;
  return e.message; // 404 など
}
