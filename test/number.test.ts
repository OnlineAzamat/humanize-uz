import { describe, it, expect } from "vitest";
import { humanizeNumber, humanizeOrdinal, numberToWords } from "../src/number";

describe("humanizeNumber", () => {
  it("should format 1000000 as '1.0 million'", () => {
    expect(humanizeNumber(1000000)).toBe("1.0 million")
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
  });
});

describe("numberToWords", () => {
  it("should convert small numbers correctly", () => {
    expect(numberToWords(0)).toBe("nol");
    expect(numberToWords(1)).toBe("bir");
    expect(numberToWords(10)).toBe("o'n");
    expect(numberToWords(11)).toBe("o'n bir");
    expect(numberToWords(25)).toBe("yigirma besh");
  });

  it("should convert larger numbers correctly", () => {
    expect(numberToWords(100)).toBe("yuz");
    expect(numberToWords(123)).toBe("yuz yigirma uch");
    expect(numberToWords(1000)).toBe("bir ming");
    expect(numberToWords(1500)).toBe("bir ming besh yuz");
    expect(numberToWords(1000000)).toBe("bir million");
  });
});