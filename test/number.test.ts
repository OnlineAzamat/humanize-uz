import { describe, it, expect } from "vitest";
import { humanizeNumber, humanizeOrdinal, numberToWords } from "../src/number";

describe("humanizeNumber", () => {
  it("should format 1000000 as '1 million'", () => {
    expect(humanizeNumber(1000000)).toBe("1 million")
  });

  it("should round to one decimal", () => {
    expect(humanizeNumber(1500)).toBe("1.5 ming")
    expect(humanizeNumber(1250000)).toBe("1.3 million")
    expect(humanizeNumber(2_000_000_000_000)).toBe("2 trillion")
  });

  it("should roll over to the next scale", () => {
    expect(humanizeNumber(999_999)).toBe("1 million")
    expect(humanizeNumber(999_960_000)).toBe("1 milliard")
  });

  it("should handle negative numbers", () => {
    expect(humanizeNumber(-5000)).toBe("-5 ming")
    expect(humanizeNumber(-42)).toBe("-42")
  });

  it("should format 500 as '500'", () => {
    expect(humanizeNumber(500)).toBe("500")
  });
});

describe("humanizeOrdinal", () => {
  it("should return short format by default", () => {
    expect(humanizeOrdinal(1)).toBe("1-");
    expect(humanizeOrdinal(10)).toBe("10-");
  });

  it("should return full format correctly", () => {
    expect(humanizeOrdinal(1, "full")).toBe("1-inchi");
    expect(humanizeOrdinal(2, "full")).toBe("2-nchi");
    expect(humanizeOrdinal(3, "full")).toBe("3-inchi");
    expect(humanizeOrdinal(6, "full")).toBe("6-nchi");
    expect(humanizeOrdinal(7, "full")).toBe("7-nchi");
    expect(humanizeOrdinal(10, "full")).toBe("10-inchi");
    expect(humanizeOrdinal(20, "full")).toBe("20-nchi");
    expect(humanizeOrdinal(22, "full")).toBe("22-nchi");
    expect(humanizeOrdinal(5, "full")).toBe("5-inchi");
    expect(humanizeOrdinal(12, "full")).toBe("12-nchi");
    expect(humanizeOrdinal(120, "full")).toBe("120-nchi");
    expect(humanizeOrdinal(100, "full")).toBe("100-inchi");
  });
});

describe("numberToWords", () => {
  it("should convert small numbers correctly", () => {
    expect(numberToWords(0)).toBe("nol");
    expect(numberToWords(1)).toBe("bir");
    expect(numberToWords(10)).toBe("o\u02BBn");
    expect(numberToWords(11)).toBe("o\u02BBn bir");
    expect(numberToWords(25)).toBe("yigirma besh");
  });

  it("should convert larger numbers correctly", () => {
    expect(numberToWords(100)).toBe("yuz");
    expect(numberToWords(123)).toBe("yuz yigirma uch");
    expect(numberToWords(1000)).toBe("bir ming");
    expect(numberToWords(1500)).toBe("bir ming besh yuz");
    expect(numberToWords(1000000)).toBe("bir million");
    expect(numberToWords(94)).toBe("to\u02BBqson to\u02BBrt");
    expect(numberToWords(2_000_000_000_000_000)).toBe("ikki kvadrillion");
    expect(numberToWords(-21)).toBe("minus yigirma bir");
  });

  it("should reject non-integers", () => {
    expect(() => numberToWords(1.5)).toThrow(RangeError);
    expect(() => numberToWords(NaN)).toThrow(RangeError);
    expect(() => numberToWords(Infinity)).toThrow(RangeError);
  });
});