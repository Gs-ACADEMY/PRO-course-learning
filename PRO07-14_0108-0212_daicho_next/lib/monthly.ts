// =============================================================
// 月の作業人数の集計
// 日報から、月ごと・現場ごとの作業人数と、職人さんへの支払いを出す
// 作成：前任の外注（2025 年）／テストなし
// =============================================================

// ---- 型 -------------------------------------------------------

/** 日報 1 件（台帳から JSON で受け取る形） */
export type Report = {
  id?: number;
  projectId?: number; // 案件番号
  date: string; // "2027-01-31" か "2027-02-01T08:00:00+09:00"
  workers: number; // 人数
  isHoliday?: boolean; // 休みの日の作業か
  note?: string;
};

/** 集計の中で使う形（date は "YYYY-MM-DD" にそろえたもの） */
type DayRow = {
  projectId: number;
  date: string;
  workers: number;
  isHoliday: boolean;
};

/** 月のまとめ */
export type MonthSummary = {
  label: string; // "2027-01"
  workers: number; // 延べ人数
  days: number; // 作業した日数
  average: number; // 1 日あたりの人数
  sites: SiteTotal[]; // 現場ごと
  payment: number; // 支払いの合計（円）
};

/** 現場ごとの合計 */
export type SiteTotal = {
  projectId: number;
  workers: number;
  days: number;
};

// ---- 設定 -----------------------------------------------------

/** 1 人 1 日あたりの日当（円） */
export const DAILY_RATE = 18000;

/** 休みの日の割増（1 人あたり・円） */
const HOLIDAY_EXTRA = 3000;

/** 集計に入れない人数の上限（入力ミスよけ） */
const MAX_WORKERS = 50;

// ---- 日付 -----------------------------------------------------

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** 日本時間の "YYYY-MM-DD"（sv-SE はこの並びで日付を書く） */
const tokyoDay = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" });

/** 日報の日付を "YYYY-MM-DD" にそろえる（時刻つきは日本時間の日付にする） */
export function toDay(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return tokyoDay.format(new Date(value));
}

/** 日付から月を取り出す（日本時間の "YYYY-MM"） */
export function monthOf(date: Date | string): string {
  return toDay(typeof date === "string" ? date : date.toISOString()).slice(0, 7);
}

/** 月の初日 */
export function monthStart(year: number, month: number): string {
  return `${year}-${pad(month)}-01`;
}

/** 月の最後の日 */
export function monthEnd(year: number, month: number): string {
  const last = new Date(year, month, 0).getDate();
  return `${year}-${pad(month)}-${pad(last)}`;
}

/** 月の日数（月の最後の日の計算は monthEnd の 1 か所だけにする） */
export function daysInMonth(year: number, month: number): number {
  return Number(monthEnd(year, month).slice(8, 10));
}

/** "2027-01" の形 */
export function monthLabel(year: number, month: number): string {
  return `${year}-${pad(month)}`;
}

/** 今月の "YYYY-MM"（画面の初期表示に使う。日本時間で） */
export function thisMonthLabel(): string {
  return monthOf(new Date());
}

/** "2027-01" から d か月ずらした "YYYY-MM"（前の月は -1、次の月は 1） */
export function shiftMonth(m: string, d: number): string {
  const [year, month] = m.split("-").map(Number);
  const t = new Date(Date.UTC(year, month - 1 + d, 1));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}`;
}

/** 先月の年と月 */
export function lastMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

// ---- 日報の確認とそろえ ----------------------------------------

/** おかしな行でないか */
export function isValid(r: DayRow): boolean {
  if (!Number.isInteger(r.workers)) return false;
  if (r.workers < 0 || r.workers > MAX_WORKERS) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) return false;
  return true;
}

/** 日報をそろえる。同じ日報が 2 回送られてくることがあるので、日報の番号（id）で 1 つにまとめる
 *  （現場と日付ではまとめない。同じ現場・同じ日の日報が 2 件あることもある） */
function normalize(reports: Report[]): DayRow[] {
  const byId = new Map<string, DayRow>();
  reports.forEach((r, i) => {
    const row: DayRow = {
      projectId: r.projectId ?? 0,
      date: toDay(r.date),
      workers: r.workers,
      isHoliday: r.isHoliday ?? false,
    };
    byId.set(r.id !== undefined ? `id-${r.id}` : `row-${i}`, row);
  });
  return [...byId.values()];
}

/** その月の行だけにする */
function rowsOf(reports: Report[], year: number, month: number): DayRow[] {
  const start = monthStart(year, month);
  const end = monthEnd(year, month);
  return normalize(reports).filter((r) => r.date >= start && r.date <= end);
}

// ---- 集計 -----------------------------------------------------

/** 月の作業人数（延べ人数） */
export function countWorkers(reports: Report[], year: number, month: number): number {
  const start = monthStart(year, month);
  const end = monthEnd(year, month);
  const rows = normalize(reports).filter((r) => r.date >= start);
  let total = 0;
  for (const r of rows) {
    if (r.date <= end) total += r.workers; // 月末の日も入れる
    if (!isValid(r)) throw new Error("bad row");
  }
  return total;
}

/** その月（"2027-01"）の延べ人数。データベースも画面も知らない（日報は外側が集めて渡す） */
type Row = { date: Date; workers: number };
export function monthlyWorkers(rows: Row[], m: string) {
  return rows
    .filter((r) => monthOf(r.date) === m)
    .reduce((s, r) => s + r.workers, 0);
}

/** 作業した日数（同じ日に何現場あっても 1 日） */
export function workDays(reports: Report[], year: number, month: number): number {
  const days = new Set(rowsOf(reports, year, month).map((r) => r.date));
  return days.size;
}

/** 1 日あたりの人数（小数 1 けた） */
export function averagePerDay(reports: Report[], year: number, month: number): number {
  const rows = rowsOf(reports, year, month);
  const total = rows.reduce((sum, r) => sum + r.workers, 0);
  const days = new Set(rows.map((r) => r.date)).size;
  if (days === 0) return 0; // 日報のない月は 0 人（0 で割らない）
  return Math.round((total / days) * 10) / 10;
}

/** 現場ごとの合計（人数の多い順） */
export function totalsBySite(reports: Report[], year: number, month: number): SiteTotal[] {
  const tmp = new Map<number, SiteTotal>();
  for (const r of rowsOf(reports, year, month)) {
    const t = tmp.get(r.projectId) ?? { projectId: r.projectId, workers: 0, days: 0 };
    t.workers += r.workers;
    t.days += 1;
    tmp.set(r.projectId, t);
  }
  return [...tmp.values()].sort((a, b) => b.workers - a.workers);
}

/** 休みの日の割増の合計（休みの日に働いた延べ人数 × 1 人あたりの割増） */
export function holidayExtra(reports: Report[], year: number, month: number): number {
  const holidayRows = rowsOf(reports, year, month).filter((r) => r.isHoliday);
  const holidayWorkers = holidayRows.reduce((sum, r) => sum + r.workers, 0);
  return holidayWorkers * HOLIDAY_EXTRA;
}

/** 職人さんへの支払い（日当 × 延べ人数 ＋ 休みの日の割増） */
export function payment(reports: Report[], year: number, month: number): number {
  const base = countWorkers(reports, year, month) * DAILY_RATE;
  return base + holidayExtra(reports, year, month);
}

/** 月のまとめ */
export function summarize(reports: Report[], year: number, month: number): MonthSummary {
  return {
    label: monthLabel(year, month),
    workers: countWorkers(reports, year, month),
    days: workDays(reports, year, month),
    average: averagePerDay(reports, year, month),
    sites: totalsBySite(reports, year, month),
    payment: payment(reports, year, month),
  };
}

/** 先月と比べた人数の増減 */
export function compareWithLastMonth(reports: Report[], year: number, month: number): number {
  const prev = lastMonth(year, month);
  const now = countWorkers(reports, year, month);
  const before = countWorkers(reports, prev.year, prev.month);
  return now - before;
}

/** 月ごとの人数（1 年分） */
export function yearlyCounts(reports: Report[], year: number): { label: string; workers: number }[] {
  const list: { label: string; workers: number }[] = [];
  for (let m = 1; m <= 12; m++) {
    const start = monthStart(year, m);
    const end = monthEnd(year, m);
    const rows = normalize(reports).filter((r) => r.date >= start && r.date <= end);
    list.push({ label: monthLabel(year, m), workers: rows.reduce((s, r) => s + r.workers, 0) });
  }
  return list;
}

/** 週ごとの人数（月曜はじまり。週の初日 "YYYY-MM-DD" ごと） */
export function weeklyCounts(reports: Report[], year: number, month: number): Map<string, number> {
  const weeks = new Map<string, number>();
  for (const r of rowsOf(reports, year, month)) {
    const d = new Date(`${r.date}T00:00:00`);
    const back = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - back);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    weeks.set(key, (weeks.get(key) ?? 0) + r.workers);
  }
  return weeks;
}

/** 日報が出ていない平日（出し忘れの確認） */
export function missingWeekdays(reports: Report[], year: number, month: number): string[] {
  const have = new Set(rowsOf(reports, year, month).map((r) => r.date));
  const list: string[] = [];
  const last = Number(monthEnd(year, month).slice(8, 10));
  for (let day = 1; day <= last; day++) {
    const d = new Date(year, month - 1, day);
    const w = d.getDay();
    const key = `${year}-${pad(month)}-${pad(day)}`;
    if (w !== 0 && w !== 6 && !have.has(key)) list.push(key);
  }
  return list;
}

/** 人数の多い現場 上位 n 件 */
export function topSites(reports: Report[], year: number, month: number, n = 3): SiteTotal[] {
  return totalsBySite(reports, year, month).slice(0, n);
}

// ---- 表示・書き出し ----------------------------------------------

/** 金額を "123,000 円" の形に */
export function formatYen(n: number): string {
  return `${n.toLocaleString("ja-JP")} 円`;
}

/** 画面に出す 1 行の説明 */
export function describe(s: MonthSummary): string {
  return `${s.label}：延べ ${s.workers} 人／${s.days} 日（1 日 ${s.average} 人）／支払い ${formatYen(s.payment)}`;
}

/** CSV で書き出す（事務の小野さんが Excel で開く） */
export function toCsv(s: MonthSummary): string {
  const lines = ["案件番号,延べ人数,日数"];
  for (const site of s.sites) {
    lines.push(`${site.projectId},${site.workers},${site.days}`);
  }
  lines.push(`合計,${s.workers},${s.days}`);
  return lines.join("\r\n");
}

/** 台帳の JSON を読む */
export function parseReports(json: string): Report[] {
  const data = JSON.parse(json) as unknown;
  if (!Array.isArray(data)) {
    throw new Error("日報の一覧ではありません");
  }
  return data.map((x) => {
    const r = x as Record<string, unknown>;
    return {
      id: typeof r.id === "number" ? r.id : undefined,
      projectId: typeof r.projectId === "number" ? r.projectId : undefined,
      date: String(r.date),
      workers: Number(r.workers),
      isHoliday: r.holiday === true || r.f === true,
      note: typeof r.note === "string" ? r.note : undefined,
    };
  });
}
