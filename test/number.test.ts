import { describe, it, expect } from "vitest";
import { humanizeNumber } from "../src/number";

describe("humanizeNumber", () => {
  it("should format 1000000 as '1.0 million'", () => {
    expect(humanizeNumber(1000000)).toBe("1.0 million")
  });

  it("should format 500 as '500'", () => {
    expect(humanizeNumber(500)).toBe("500")
  });
});