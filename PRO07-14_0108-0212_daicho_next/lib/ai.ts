// AI に日報の要約を頼む所（依頼 3）。鍵はサーバーの環境変数だけで読む（名前に NEXT_PUBLIC_ を付けない）
// AI の頼み先は、まだ決めていない。決まるまでは「仮の要約」：日報を 1 件 1 行で、5 行まで返す
export async function summarize(notes: string[]): Promise<string[]> {
  const key = process.env.AI_API_KEY;
  if (!key) throw new Error("AI_API_KEY is not set");
  // 頼み先が決まったら、ここで AI の API を呼ぶ（key を付けて）
  return notes.slice(0, 5);
}
