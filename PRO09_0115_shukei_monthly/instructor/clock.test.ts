import { it, expect, vi } from "vitest";
import { thisMonthLabel } from "./monthly";

it("2/1 の朝 8 時なら「2 月」と答える", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2027-02-01T08:00:00+09:00"));
  expect(thisMonthLabel()).toBe("2027-02");
  vi.useRealTimers();
});
