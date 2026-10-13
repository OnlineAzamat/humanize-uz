import { describe, it, expect } from "vitest";
import { humanizeCurrency } from "../src/currency";

describe("humanizeCurrency", () => {
  it("should format 125000 as '125 000 soʻm", () => {
    expect(humanizeCurrency(125000).normalize("NFC")).toBe("125 000 soʻm".normalize("NFC"));
  });

  it("should format 150000 as '$150 000'", () => {
    expect(humanizeCurrency(150000, 'USD').normalize("NFC")).toBe("$150 000".normalize("NFC"));
  });

  it("should group only the integer part and keep up to 2 decimals", () => {
    expect(humanizeCurrency(1234.5)).toBe("1 234.5 so\u02BBm");
    expect(humanizeCurrency(0.1234, "USD")).toBe("$0.12");
    expect(humanizeCurrency(1000)).toBe("1 000 so\u02BBm");
  });

  it("should put the minus sign before the currency symbol", () => {
    expect(humanizeCurrency(-100, "USD")).toBe("-$100");
    expect(humanizeCurrency(-1000)).toBe("-1 000 so\u02BBm");
  });

  it("should drop the minus sign when the amount rounds to zero", () => {
    expect(humanizeCurrency(-0.001, "USD")).toBe("$0");
    expect(humanizeCurrency(-0.004)).toBe("0 so\u02BBm");
    expect(humanizeCurrency(-0.05)).toBe("-0.05 so\u02BBm");
  });

  it("should not label unsupported currencies as UZS", () => {
    expect(humanizeCurrency(100, "EUR" as "UZS")).toBe("100");
  });
});
