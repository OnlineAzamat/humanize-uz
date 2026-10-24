import { describe, it, expect } from "vitest";
import { normalizeKaa, toUpperKaa, toLowerKaa, transliterateKaa } from "../src/kaa";
import { transliterate } from "../src/transliterate";

describe("toUpperKaa / toLowerKaa", () => {
  it("should map dotless ı to Í and back", () => {
    expect(toUpperKaa("altı")).toBe("ALTÍ");
    expect(toLowerKaa("ALTÍ")).toBe("altı");
    expect(toUpperKaa("Nókis")).toBe("NÓKIS");
    expect(toLowerKaa("NÓKIS")).toBe("nókis");
    // standart funksiyalar bu harfni buzadi
    expect("altı".toUpperCase()).toBe("ALTI");
  });
});

describe("normalizeKaa", () => {
  it("should fix í, combining marks and pre-2016 apostrophe letters", () => {
    expect(normalizeKaa("altí")).toBe("altı");
    expect(normalizeKaa("altı́")).toBe("altı");
    expect(normalizeKaa("Nókis")).toBe("Nókis");
    expect(normalizeKaa("No'kis")).toBe("Nókis");
    expect(normalizeKaa("Qarag'ash")).toBe("Qaraǵash");
    expect(normalizeKaa("ALTÍ")).toBe("ALTÍ");
  });
});

describe("transliterateKaa", () => {
  it("should convert Cyrillic to Latin", () => {
    expect(transliterateKaa("Қарақалпақстан", "kaa-Latn")).toBe("Qaraqalpaqstan");
    expect(transliterateKaa("Нөкис", "kaa-Latn")).toBe("Nókis");
    expect(transliterateKaa("Шымбай", "kaa-Latn")).toBe("Shımbay");
    expect(transliterateKaa("әке, үй, ғарры, мың, сўм", "kaa-Latn")).toBe("áke, úy, ǵarrı, mıń, swm");
    expect(transliterateKaa("ЫРАС", "kaa-Latn")).toBe("ÍRAS");
    expect(transliterateKaa("ШЫМБАЙ", "kaa-Latn")).toBe("SHÍMBAY");
  });

  it("should convert Latin to Cyrillic", () => {
    expect(transliterateKaa("Qaraqalpaqstan Respublikası", "kaa-Cyrl")).toBe("Қарақалпақстан Республикасы");
    expect(transliterateKaa("Nókis", "kaa-Cyrl")).toBe("Нөкис");
    expect(transliterateKaa("Shımbay", "kaa-Cyrl")).toBe("Шымбай");
    expect(transliterateKaa("cirk, chay", "kaa-Cyrl")).toBe("цирк, чай");
    expect(transliterateKaa("ÍRAS", "kaa-Cyrl")).toBe("ЫРАС");
  });

  it("should round-trip a sentence", () => {
    const latn = "Qaraqalpaqstan Respublikasınıń paytaxtı — Nókis qalası.";
    const cyrl = transliterateKaa(latn, "kaa-Cyrl");
    expect(cyrl).toBe("Қарақалпақстан Республикасының пайтахты — Нөкис қаласы.");
    expect(transliterateKaa(cyrl, "kaa-Latn")).toBe(latn);
  });
});

describe("transliterate with Karakalpak locales", () => {
  it("should route kaa locales to the Karakalpak rules", () => {
    expect(transliterate("Нөкис", { to: "kaa-Latn" })).toBe("Nókis");
    expect(transliterate("Nókis", { from: "kaa-Latn", to: "kaa-Cyrl" })).toBe("Нөкис");
  });

  it("should refuse to mix Uzbek and Karakalpak", () => {
    expect(() => transliterate("Nókis", { from: "kaa-Latn", to: "uz-Cyrl" })).toThrow(RangeError);
    expect(() => transliterate("Shahar", { from: "uz-Latn", to: "kaa-Cyrl" })).toThrow(RangeError);
  });
});
