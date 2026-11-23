// 役割と「何をしてよいか」の決まり（サーバーでも画面でも、ここを見る）

export const ROLES = {
  president: "社長",
  sales: "営業",
  office: "事務",
  supervisor: "監督",
} as const;
export type Role = keyof typeof ROLES;

export function roleLabel(role: string | null | undefined): string {
  return ROLES[(role ?? "") as Role] ?? "（役割なし）";
}

/** 金額を見てよい役割（依頼 1：金額は社長と営業と事務だけ） */
export function canSeeAmount(role: string | null | undefined): boolean {
  return role === "president" || role === "sales" || role === "office";
}

/** 金額を変えてよいか（依頼 1 の決まりと同じ：社長と営業と事務）。
 *  いまは役割だけで決めているが、案件ごとの決まりが増えてデータベースを見るようになっても、呼ぶ側は同じ形で使える */
export async function canEditAmount(user: { role?: string | null }, projectId: number): Promise<boolean> {
  void projectId; // 案件ごとの決まりは、まだない
  return canSeeAmount(user.role);
}

/** 日報の要約を見る役割（依頼 3：社長と事務） */
export function canSeeSummary(role: string | null | undefined): boolean {
  return role === "president" || role === "office";
}

/** 受け口で金額を外すか（.env の AMOUNT_GUARD="off" で「画面で隠しただけ」の版にできる） */
export function amountGuardOn(): boolean {
  return process.env.AMOUNT_GUARD !== "off";
}

/** 日報の受け口で「自分の日報か」を確かめるか（.env の REPORT_GUARD="off" で確かめない版にできる。1/12 の実演用） */
export function reportGuardOn(): boolean {
  return process.env.REPORT_GUARD !== "off";
}
