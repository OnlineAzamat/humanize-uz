import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { humanizeDate, timeAgo } from "../src/date";

const NOW = new Date("2026-03-09T12:00:00");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

const ago = (ms: number) => new Date(NOW.getTime() - ms);

describe("timeAgo", () => {
  it("should return 'hozirgina' for the last few seconds", () => {
    expect(timeAgo(ago(2_000))).toBe("hozirgina");
  });

  it("should format each unit correctly", () => {
    expect(timeAgo(ago(30_000))).toBe("30 soniya oldin");
    expect(timeAgo(ago(90_000))).toBe("1 daqiqa oldin");
    expect(timeAgo(ago(10 * 60_000))).toBe("10 daqiqa oldin");
    expect(timeAgo(ago(3 * 3_600_000))).toBe("3 soat oldin");
    expect(timeAgo(ago(2 * 86_400_000))).toBe("2 kun oldin");
  });

  it("should format future dates", () => {
    expect(timeAgo(ago(-5 * 60_000))).toBe("5 daqiqadan keyin");
    expect(timeAgo(ago(-2 * 3_600_000))).toBe("2 soatdan keyin");
  });

  it("should accept strings and timestamps", () => {
    expect(timeAgo("2026-03-09T11:00:00")).toBe("1 soat oldin");
    expect(timeAgo(NOW.getTime() - 60_000)).toBe("1 daqiqa oldin");
  });

  it("should reject invalid dates", () => {
    expect(() => timeAgo("not a date")).toThrow(RangeError);
  });
});

describe("humanizeDate", () => {
  it("should use calendar days", () => {
    expect(humanizeDate("2026-03-09T00:01:00")).toBe("bugun");
    // 13 soat oldin, lekin kalendar bo'yicha kecha
    expect(humanizeDate("2026-03-08T23:00:00")).toBe("kecha");
    expect(humanizeDate("2026-03-06T12:00:00")).toBe("3 kun oldin");
  });

  it("should format future dates", () => {
    expect(humanizeDate("2026-03-10T08:00:00")).toBe("ertaga");
    expect(humanizeDate("2026-03-12T08:00:00")).toBe("3 kundan keyin");
  });

  it("should fall back to a full date after a week", () => {
    expect(humanizeDate("2026-02-01T12:00:00")).toBe(new Date("2026-02-01T12:00:00").toLocaleDateString("uz-UZ"));
  });
});
