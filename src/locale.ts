import { transliterate } from "./transliterate.js";

/**
 * Til va yozuv:
 * - "uz-Latn"      — amaldagi lotin imlosi (oʻ, gʻ, sh, ch)
 * - "uz-Latn-2026" — 2026-yilgi yangi lotin imlosi (ö, ğ, ş, ç)
 * - "uz-Cyrl"      — kirill yozuvi
 */
export type UzLocale = "uz-Latn" | "uz-Latn-2026" | "uz-Cyrl";

export interface LocaleOptions {
  /** Natija yozuvi va imlosi (standart: "uz-Latn") */
  locale?: UzLocale;
}

/** Amaldagi lotin imlosida yozilgan matnni tanlangan yozuvga oʻtkazish */
export function localize(text: string, locale: UzLocale = "uz-Latn"): string {
  if (locale === "uz-Latn") return text;
  return transliterate(text, { from: "uz-Latn", to: locale });
}

/**
 * Intl bilan formatlash: kirill uchun Intl'ning oʻzi ("10 сентябр"),
 * 2026 imlosi uchun Intl'ning lotin natijasi oʻtkaziladi
 */
export function formatIntl(
  locale: UzLocale = "uz-Latn",
  format: (intlLocale: string) => string
): string {
  if (locale === "uz-Cyrl") return format("uz-Cyrl");
  return localize(format("uz-Latn"), locale);
}
