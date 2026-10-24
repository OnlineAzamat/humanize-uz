import { describe, it, expect } from "vitest";
import { amountToWords } from "../src/amount";

describe("amountToWords", () => {
  it("should write sums in words with tiyin as digits", () => {
    expect(amountToWords(1250000.5)).toBe("bir million ikki yuz ellik ming soʻm 50 tiyin");
    expect(amountToWords(1250000)).toBe("bir million ikki yuz ellik ming soʻm");
    expect(amountToWords(12.05)).toBe("oʻn ikki soʻm 05 tiyin");
    expect(amountToWords(0)).toBe("nol soʻm");
  });

  it("should support other currencies", () => {
    expect(amountToWords(100, { currency: "USD" })).toBe("yuz dollar");
    expect(amountToWords(9.99, { currency: "EUR" })).toBe("toʻqqiz yevro 99 sent");
  });

  it("should write the fraction in words and capitalize on request", () => {
    expect(amountToWords(12.05, { fraction: "words", capitalize: true })).toBe("Oʻn ikki soʻm besh tiyin");
  });

  it("should round to 2 decimals and handle the sign after rounding", () => {
    expect(amountToWords(1.999)).toBe("ikki soʻm");
    expect(amountToWords(-21)).toBe("minus yigirma bir soʻm");
    expect(amountToWords(-0.001)).toBe("nol soʻm");
  });

  it("should follow the locale", () => {
    expect(amountToWords(1250000.5, { locale: "uz-Latn-2026" })).toBe("bir million ikki yuz ellik ming söm 50 tiyin");
    expect(amountToWords(12.05, { locale: "uz-Cyrl", fraction: "words", capitalize: true })).toBe("Ўн икки сўм беш тийин");
    expect(amountToWords(1250000.5, { locale: "kaa-Latn" })).toBe("bir million eki júz eliw mıń swm 50 tıyın");
    expect(amountToWords(100, { locale: "kaa-Cyrl", currency: "USD", capitalize: true })).toBe("Жүз доллар");
  });

  it("should reject invalid amounts", () => {
    expect(() => amountToWords(NaN)).toThrow(RangeError);
    expect(() => amountToWords(1e20)).toThrow(RangeError);
  });
});
