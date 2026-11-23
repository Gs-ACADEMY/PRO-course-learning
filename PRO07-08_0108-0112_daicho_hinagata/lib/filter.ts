import type { Status } from "@/lib/generated/prisma/enums";
import { STATUS_LABEL } from "@/lib/status";

const STATUSES = Object.keys(STATUS_LABEL) as Status[];

/**
 * URL の ?status= の値を、絞り込む状態に直す
 * 6 つの状態の名前なら、その状態。空・知らない値・2 つ以上なら undefined（＝絞り込まない）
 */
export function parseStatus(value: string | string[] | undefined): Status | undefined {
  return STATUSES.find((s) => s === value);
}
