import { describe, it, expect } from "vitest";
import { humanizeCurrency } from "../src/currency";

describe("humanizeCurrency", () => {
  it("should format 125000 as '125 000 soʻm", () => {
    expect(humanizeCurrency(125000).normalize("NFC")).toBe("125 000 soʻm".normalize("NFC"));
  });

  it("should format 150000 as '$150 000'", () => {
    expect(humanizeCurrency(150000, 'USD').normalize("NFC")).toBe("$150 000".normalize("NFC"));
  });
});