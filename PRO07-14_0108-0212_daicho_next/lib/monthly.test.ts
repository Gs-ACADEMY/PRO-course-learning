import { afterEach, describe, expect, it, vi } from "vitest";
import { averagePerDay, countWorkers, holidayExtra, monthlyWorkers, parseReports, thisMonthLabel } from "./monthly";

// 依頼 2：直す前に、月末と月またぎのテストを書く（書いた時点では落ちる）

describe("月末", () => {
  it("月末（1/31）の作業も 1 月に数える", () => {
    const reports = [
      { date: "2027-01-31", workers: 3 },
      { date: "2027-02-01", workers: 2 },
    ];
    expect(countWorkers(reports, 2027, 1)).toBe(3);
  });
});

describe("月またぎ", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("2/1 の朝 8 時（日本時間）の日報は 2 月に数える", () => {
    const reports = [{ date: "2027-02-01T08:00:00+09:00", workers: 4 }];
    expect(countWorkers(reports, 2027, 1)).toBe(0);
    expect(countWorkers(reports, 2027, 2)).toBe(4);
  });

  it("2/1 の朝 8 時なら、今月は 2 月と答える", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-02-01T08:00:00+09:00"));
    expect(thisMonthLabel()).toBe("2027-02");
  });
});

describe("ほかの境界", () => {
  it("同じ現場・同じ日に日報が 2 件あっても、両方数える", () => {
    const reports = [
      { id: 1, projectId: 5, date: "2027-01-12", workers: 3 },
      { id: 2, projectId: 5, date: "2027-01-12", workers: 2 },
    ];
    expect(countWorkers(reports, 2027, 1)).toBe(5);
  });

  it("日報が 0 件の月は、1 日あたり 0 人（NaN にしない）", () => {
    expect(averagePerDay([], 2027, 3)).toBe(0);
  });

  it("休みの日の割増は、人数ぶん（3 人なら 3 人分）", () => {
    const reports = parseReports('[{"date":"2027-01-10","workers":3,"holiday":true}]');
    expect(holidayExtra(reports, 2027, 1)).toBe(3 * 3000);
  });
});

describe("中心に置いた集計（1/22）", () => {
  it("データベースなしで試せる：日本時間の 2/1 0:30 は 2 月、1/31 23:30 は 1 月", () => {
    const rows = [
      { date: new Date("2027-01-31T15:30:00Z"), workers: 2 }, // 日本時間 2/1 0:30
      { date: new Date("2027-01-31T14:30:00Z"), workers: 5 }, // 日本時間 1/31 23:30
    ];
    expect(monthlyWorkers(rows, "2027-01")).toBe(5);
    expect(monthlyWorkers(rows, "2027-02")).toBe(2);
  });
});
