import { describe, expect, it } from "vitest";
import { parseStatus } from "@/lib/filter";

describe("URL の status を、絞り込む状態に直す", () => {
  it("6 つの状態の名前なら、その状態で絞り込む", () => {
    expect(parseStatus("ESTIMATING")).toBe("ESTIMATING");
    expect(parseStatus("INVOICED")).toBe("INVOICED");
  });

  it("空・知らない値・2 つ以上なら、絞り込まない（undefined）", () => {
    expect(parseStatus(undefined)).toBeUndefined(); // ?status= がない
    expect(parseStatus("")).toBeUndefined(); // 「すべて」を選んだ
    expect(parseStatus("見積中")).toBeUndefined(); // 日本語の名前ではなく、英語の名前で送る
    expect(parseStatus("estimating")).toBeUndefined(); // 小文字は別の値
    expect(parseStatus(["ESTIMATING", "DONE"])).toBeUndefined(); // ?status=ESTIMATING&status=DONE
  });
});
