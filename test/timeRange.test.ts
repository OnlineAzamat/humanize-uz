import { describe, expect, it } from "vitest";
import { humanizeTimeRange } from "../src/timeRange";

describe("timeRange", () => {
  it( "should format '2025-08-10T09:00 2025-08-10T17:30' as '10 avgust 2025, 09:00 - 17:30'", () => {
    expect(humanizeTimeRange(
      new Date('2025-08-10T09:00'), 
      new Date('2025-08-10T17:30')
    )).toBe("10-avgust, 2025, 09:00 - 17:30");
  });
});