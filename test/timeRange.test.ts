import { describe, expect, it } from "vitest";
import { humanizeTimeRange } from "../src/timeRange";

describe("timeRange", () => {
  it( "should format '2025-08-10T09:00 2025-08-10T17:30' as '10 avgust 2025, 09:00 - 17:30'", () => {
    expect(humanizeTimeRange(
      new Date('2025-08-10T09:00'), 
      new Date('2025-08-10T17:30')
    )).toBe("10-avgust, 2025, 09:00 - 17:30");
  });

  it("should include both dates when the range spans days", () => {
    expect(humanizeTimeRange(
      new Date('2025-08-10T09:00'),
      new Date('2025-08-11T17:30')
    )).toBe("10-avgust, 2025, 09:00 - 11-avgust, 2025, 17:30");
  });
});

it.each(["uz-Latn", "uz-Latn-2026", "uz-Cyrl", "kaa-Latn", "kaa-Cyrl"] as const)("rejects either invalid endpoint in %s", locale => {
  const valid = new Date("2026-01-01T12:00:00");
  for (const [start, end] of [[new Date(NaN), valid], [valid, new Date(NaN)], [new Date(NaN), new Date(NaN)]]) {
    expect(() => humanizeTimeRange(start, end, { locale })).toThrow(RangeError);
  }
});
