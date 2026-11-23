import type { Status } from "@/lib/generated/prisma/enums";

/** 状態の表示名（6 つ） */
export const STATUS_LABEL: Record<Status, string> = {
  SURVEY: "現地調査",
  ESTIMATING: "見積中",
  CONTRACTED: "契約",
  IN_PROGRESS: "工事中",
  DONE: "完了",
  INVOICED: "請求済",
};
