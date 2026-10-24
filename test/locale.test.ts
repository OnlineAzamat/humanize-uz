import { describe, it, expect } from "vitest";
import {
  humanizeNumber,
  numberToWords,
  humanizeOrdinal,
  humanizeDate,
  timeAgo,
  humanizeTimeRange,
  humanizeCurrency,
  humanizeFileSize,
  humanizeList,
  ordinalToWords,
} from "../src/index";

describe("locale option", () => {
  it("should keep current Latin by default", () => {
    expect(numberToWords(94)).toBe("toʻqson toʻrt")
    expect(numberToWords(94, { locale: "uz-Latn" })).toBe("toʻqson toʻrt")
  });

  it("should write numbers in the 2026 alphabet and Cyrillic", () => {
    expect(numberToWords(94, { locale: "uz-Latn-2026" })).toBe("töqson tört")
    expect(numberToWords(94, { locale: "uz-Cyrl" })).toBe("тўқсон тўрт")
    expect(numberToWords(-65, { locale: "uz-Latn-2026" })).toBe("minus oltmiş beş")
    expect(humanizeNumber(1500, { locale: "uz-Cyrl" })).toBe("1.5 минг")
    expect(humanizeOrdinal(2, "full", { locale: "uz-Latn-2026" })).toBe("2-nçi")
    expect(humanizeOrdinal(3, "full", { locale: "uz-Cyrl" })).toBe("3-инчи")
    expect(humanizeOrdinal(3, "short", { locale: "uz-Cyrl" })).toBe("3-")
  });

  it("should localize relative dates", () => {
    expect(humanizeDate(new Date(), { locale: "uz-Cyrl" })).toBe("бугун")
    expect(humanizeDate(Date.now() - 86_400_000, { locale: "uz-Latn-2026" })).toBe("keça")
    expect(timeAgo(Date.now() - 2 * 3600 * 1000, { locale: "uz-Cyrl" })).toBe("2 соат олдин")
    expect(timeAgo(Date.now() + 5 * 60 * 1000 + 500, { locale: "uz-Latn-2026" })).toBe("5 daqiqadan keyin")
  });

  it("should use Intl Cyrillic month names", () => {
    const start = new Date("2025-09-10T09:00")
    const end = new Date("2025-09-10T17:30")
    // ICU versiyasiga bogʻlanmaslik uchun natija Intl'ning oʻzi bilan solishtiriladi
    const dateOpts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    const cyrlDate = start.toLocaleDateString("uz-Cyrl", dateOpts)
    expect(humanizeTimeRange(start, end, { locale: "uz-Cyrl" })).toBe(`${cyrlDate}, 09:00 - 17:30`)
    expect(cyrlDate).toMatch(/[Ѐ-ӿ]/)
    expect(humanizeTimeRange(start, end, { locale: "uz-Latn-2026" })).toMatch(/^[^Ѐ-ӿ]+$/)
  });

  it("should localize currency, file size and list words", () => {
    expect(humanizeCurrency(125000, "UZS", { locale: "uz-Latn-2026" })).toBe("125 000 söm")
    expect(humanizeCurrency(125000, "UZS", { locale: "uz-Cyrl" })).toBe("125 000 сўм")
    expect(humanizeCurrency(100, "USD", { locale: "uz-Cyrl" })).toBe("$100")
    expect(humanizeFileSize(0, 2, { locale: "uz-Cyrl" })).toBe("0 Байт")
    expect(humanizeFileSize(1572864, 1, { locale: "uz-Cyrl" })).toBe("1.5 МБ")
    expect(humanizeList(["olma", "anor"], "va", { locale: "uz-Cyrl" })).toBe("olma ва anor")
  });
});

describe("Karakalpak locale", () => {
  it("should write numbers and ordinals", () => {
    expect(numberToWords(1994, { locale: "kaa-Latn" })).toBe("bir mıń toǵız júz toqsan tórt")
    expect(numberToWords(1994, { locale: "kaa-Cyrl" })).toBe("бир мың тоғыз жүз тоқсан төрт")
    expect(humanizeNumber(1500, { locale: "kaa-Latn" })).toBe("1.5 mıń")
    expect(humanizeNumber(2_500_000, { locale: "kaa-Cyrl" })).toBe("2.5 миллион")
    expect(ordinalToWords(2, { locale: "kaa-Latn" })).toBe("ekinshi")
    expect(ordinalToWords(6, { locale: "kaa-Latn" })).toBe("altınshı")
    expect(ordinalToWords(9, { locale: "kaa-Latn" })).toBe("toǵızınshı")
    expect(ordinalToWords(100, { locale: "kaa-Latn" })).toBe("júzinshi")
    expect(ordinalToWords(6, { locale: "kaa-Cyrl" })).toBe("алтыншы")
    expect(humanizeOrdinal(2, "full", { locale: "kaa-Latn" })).toBe("2-nshi")
    expect(humanizeOrdinal(6, "full", { locale: "kaa-Latn" })).toBe("6-nshı")
    expect(humanizeOrdinal(1, "full", { locale: "kaa-Latn" })).toBe("1-inshi")
  });

  it("should write relative dates and time", () => {
    expect(humanizeDate(new Date(), { locale: "kaa-Latn" })).toBe("búgin")
    expect(humanizeDate(Date.now() - 86_400_000, { locale: "kaa-Cyrl" })).toBe("кеше")
    expect(timeAgo(Date.now() - 2 * 3600 * 1000, { locale: "kaa-Latn" })).toBe("2 saat burın")
    expect(timeAgo(Date.now() - 2 * 3600 * 1000, { locale: "kaa-Cyrl" })).toBe("2 саат бурын")
    expect(timeAgo(Date.now() + 5 * 60 * 1000 + 500, { locale: "kaa-Latn" })).toBe("5 minuttan keyin")
  });

  it("should format dates without Intl", () => {
    const old = new Date(2025, 7, 10, 12)
    expect(humanizeDate(old, { locale: "kaa-Latn" })).toBe("10.08.2025")
    const start = new Date("2025-08-10T09:00")
    expect(humanizeTimeRange(start, new Date("2025-08-10T17:30"), { locale: "kaa-Latn" })).toBe("10-avgust, 2025, 09:00 - 17:30")
    expect(humanizeTimeRange(start, new Date("2025-08-11T17:30"), { locale: "kaa-Cyrl" })).toBe("10-август, 2025, 09:00 - 11-август, 2025, 17:30")
  });

  it("should localize currency, file size and list words", () => {
    expect(humanizeCurrency(125000, "UZS", { locale: "kaa-Latn" })).toBe("125 000 swm")
    expect(humanizeCurrency(125000, "UZS", { locale: "kaa-Cyrl" })).toBe("125 000 сўм")
    expect(humanizeFileSize(1572864, 1, { locale: "kaa-Cyrl" })).toBe("1.5 МБ")
    expect(humanizeList(["alma", "anar", "júzim"], undefined, { locale: "kaa-Latn" })).toBe("alma, anar hám júzim")
    expect(humanizeList(["alma", "anar"], undefined, { locale: "kaa-Cyrl" })).toBe("alma ҳәм anar")
  });
});
