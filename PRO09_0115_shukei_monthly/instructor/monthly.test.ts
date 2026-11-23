import { describe, it, expect } from "vitest";
import { countWorkers } from "./monthly";

describe("月の作業人数", () => {
  it("月末（1/31）の作業も 1 月に数える", () => {
    const reports = [
      { date: "2027-01-31", workers: 3 },
      { date: "2027-02-01", workers: 2 },
    ];
    // この入力なら、答えは 3（1 月の分だけ）
    expect(countWorkers(reports, 2027, 1)).toBe(3);
  });
});
