import { describe, it, expect } from "vitest";
import { addSuffix } from "../src/suffix";

describe("addSuffix", () => {
  it("should apply the -ga / -ka / -qa rule", () => {
    expect(addSuffix("maktab", "ga")).toBe("maktabga");
    expect(addSuffix("bank", "ga")).toBe("bankka");
    expect(addSuffix("barg", "ga")).toBe("bargka");
    expect(addSuffix("qishloq", "ga")).toBe("qishloqqa");
    expect(addSuffix("bogʻ", "ga")).toBe("bogʻqa");
    expect(addSuffix("bog'", "ga")).toBe("bog'qa");
    expect(addSuffix("tong", "ga")).toBe("tongga");
    expect(addSuffix("bank", "gacha")).toBe("bankkacha");
    expect(addSuffix("Toshkent", "-ga")).toBe("Toshkentga");
  });

  it("should leave other suffixes unchanged", () => {
    expect(addSuffix("bank", "da")).toBe("bankda");
    expect(addSuffix("qishloq", "dan")).toBe("qishloqdan");
    expect(addSuffix("kitob", "ning")).toBe("kitobning");
  });

  it("should pick the suffix from how a number is read", () => {
    expect(addSuffix(5, "ga")).toBe("5-ga");
    expect(addSuffix(50, "ga")).toBe("50-ka");
    expect(addSuffix(40, "ga")).toBe("40-qa");
    expect(addSuffix(1000, "ga")).toBe("1000-ga");
    expect(addSuffix(2026, "da")).toBe("2026-da");
    expect(addSuffix(0, "ga")).toBe("0-ga");
  });

  it("should follow the locale", () => {
    expect(addSuffix("банк", "ga", { locale: "uz-Cyrl" })).toBe("банкка");
    expect(addSuffix("қишлоқ", "ga", { locale: "uz-Cyrl" })).toBe("қишлоққа");
    expect(addSuffix("bağ", "ga", { locale: "uz-Latn-2026" })).toBe("bağqa");
    expect(addSuffix(50, "gacha", { locale: "uz-Cyrl" })).toBe("50-кача");
  });

  it("should reject Karakalpak and invalid numbers", () => {
    expect(() => addSuffix("bank", "ga", { locale: "kaa-Latn" })).toThrow(RangeError);
    expect(() => addSuffix(NaN, "ga")).toThrow(RangeError);
  });
});
