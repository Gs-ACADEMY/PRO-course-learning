// 記録（ログ）を 1 件ずつ、項目で残す（構造化ログ。2/5）
// いつ（time）・どこで（path）・誰に（userId）・何が（status と message）。公開先のログの画面で、項目で絞り込める

type Level = "info" | "warn" | "error";
type Fields = {
  path: string;
  status: number;
  userId: string | null;
  message: string;
};

/** 日本時間の時刻（例：2027-02-05T09:12:03+09:00）。相手の言う時刻と突き合わせやすいように */
function nowInTokyo(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 19) + "+09:00";
}

export function log(level: Level, fields: Fields) {
  const line = JSON.stringify({ time: nowInTokyo(), level, ...fields });
  if (level === "error") console.error(line);
  else console.log(line);
}
