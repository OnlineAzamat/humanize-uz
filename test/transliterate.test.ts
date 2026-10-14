import { describe, it, expect } from "vitest";
import { transliterate, detectScript } from "../src/transliterate";

describe("transliterate", () => {
  it("should convert current Latin to the 2026 alphabet", () => {
    expect(transliterate("Oʻzbekiston", { to: "uz-Latn-2026" })).toBe("Özbekiston")
    expect(transliterate("gʻisht", { to: "uz-Latn-2026" })).toBe("ğişt")
    expect(transliterate("shahar", { to: "uz-Latn-2026" })).toBe("şahar")
    expect(transliterate("choʻqqi", { to: "uz-Latn-2026" })).toBe("çöqqi")
    expect(transliterate("O'zbekiston", { to: "uz-Latn-2026" })).toBe("Özbekiston")
    expect(transliterate("Isʼhoq", { to: "uz-Latn-2026" })).toBe("Ishoq")
    expect(transliterate("maʼno", { to: "uz-Latn-2026" })).toBe("maʼno")
  });

  it("should convert the 2026 alphabet back to current Latin", () => {
    expect(transliterate("Özbekiston", { to: "uz-Latn" })).toBe("Oʻzbekiston")
    expect(transliterate("çöqqi", { to: "uz-Latn" })).toBe("choʻqqi")
    expect(transliterate("Ishoq", { from: "uz-Latn-2026", to: "uz-Latn" })).toBe("Isʼhoq")
    expect(transliterate("Işoq va Ishoq", { to: "uz-Latn" })).toBe("Ishoq va Isʼhoq")
  });

  it("should keep letter case", () => {
    expect(transliterate("SHAHAR", { to: "uz-Latn-2026" })).toBe("ŞAHAR")
    expect(transliterate("ŞAHAR", { to: "uz-Latn" })).toBe("SHAHAR")
    expect(transliterate("Şahar", { to: "uz-Latn" })).toBe("Shahar")
    expect(transliterate("ÇÖL", { to: "uz-Latn" })).toBe("CHOʻL")
    expect(transliterate("ШАҲАР", { to: "uz-Latn" })).toBe("SHAHAR")
    expect(transliterate("Ёз", { to: "uz-Latn" })).toBe("Yoz")
    expect(transliterate("ЁЗ", { to: "uz-Latn" })).toBe("YOZ")
  });

  it("should convert Cyrillic to Latin", () => {
    expect(transliterate("Ўзбекистон", { to: "uz-Latn" })).toBe("Oʻzbekiston")
    expect(transliterate("Ўзбекистон", { to: "uz-Latn-2026" })).toBe("Özbekiston")
    expect(transliterate("Шаҳар", { to: "uz-Latn" })).toBe("Shahar")
    expect(transliterate("Исҳоқ", { to: "uz-Latn" })).toBe("Isʼhoq")
    expect(transliterate("Исҳоқ", { to: "uz-Latn-2026" })).toBe("Ishoq")
    expect(transliterate("ер", { to: "uz-Latn" })).toBe("yer")
    expect(transliterate("эшик", { to: "uz-Latn" })).toBe("eshik")
    expect(transliterate("тайёр", { to: "uz-Latn" })).toBe("tayyor")
    expect(transliterate("объект", { to: "uz-Latn" })).toBe("obyekt")
    expect(transliterate("маъно", { to: "uz-Latn" })).toBe("maʼno")
    expect(transliterate("цирк", { to: "uz-Latn" })).toBe("sirk")
    expect(transliterate("милиция", { to: "uz-Latn" })).toBe("militsiya")
  });

  it("should convert Latin to Cyrillic", () => {
    expect(transliterate("Oʻzbekiston", { to: "uz-Cyrl" })).toBe("Ўзбекистон")
    expect(transliterate("Özbekiston", { to: "uz-Cyrl" })).toBe("Ўзбекистон")
    expect(transliterate("shahar", { to: "uz-Cyrl" })).toBe("шаҳар")
    expect(transliterate("choʻqqi", { to: "uz-Cyrl" })).toBe("чўққи")
    expect(transliterate("Isʼhoq", { to: "uz-Cyrl" })).toBe("Исҳоқ")
    expect(transliterate("yetti", { to: "uz-Cyrl" })).toBe("етти")
    expect(transliterate("eshik", { to: "uz-Cyrl" })).toBe("эшик")
    expect(transliterate("poeziya", { to: "uz-Cyrl" })).toBe("поэзия")
    expect(transliterate("tayyor", { to: "uz-Cyrl" })).toBe("тайёр")
    expect(transliterate("yoʻq", { to: "uz-Cyrl" })).toBe("йўқ")
    expect(transliterate("obyekt", { to: "uz-Cyrl" })).toBe("объект")
    expect(transliterate("taʼlim", { to: "uz-Cyrl" })).toBe("таълим")
    expect(transliterate("TOSHKENT", { to: "uz-Cyrl" })).toBe("ТОШКЕНТ")
  });

  it("should round-trip sentences", () => {
    const latn = "Toshkent — Oʻzbekistonning poytaxti, shahar aholisi tez oʻsmoqda."
    const cyrl = transliterate(latn, { to: "uz-Cyrl" })
    expect(cyrl).toBe("Тошкент — Ўзбекистоннинг пойтахти, шаҳар аҳолиси тез ўсмоқда.")
    expect(transliterate(cyrl, { to: "uz-Latn" })).toBe(latn)
    const latn2026 = transliterate(latn, { to: "uz-Latn-2026" })
    expect(latn2026).toBe("Toşkent — Özbekistonning poytaxti, şahar aholisi tez ösmoqda.")
    expect(transliterate(latn2026, { to: "uz-Latn" })).toBe(latn)
  });

  it("should respect an explicit source orthography", () => {
    // "sh" 2026 imlosida s+h, amaldagi imloda esa ş
    expect(transliterate("Ishoq", { from: "uz-Latn-2026", to: "uz-Cyrl" })).toBe("Исҳоқ")
    expect(transliterate("Ishoq", { from: "uz-Latn", to: "uz-Cyrl" })).toBe("Ишоқ")
  });
});

describe("detectScript", () => {
  it("should detect the script and orthography", () => {
    expect(detectScript("Шаҳар")).toBe("uz-Cyrl")
    expect(detectScript("Şahar")).toBe("uz-Latn-2026")
    expect(detectScript("Shahar")).toBe("uz-Latn")
    expect(detectScript("O'zbekiston")).toBe("uz-Latn")
  });
});
