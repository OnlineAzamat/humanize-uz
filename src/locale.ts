import { transliterate } from "./transliterate.js";
import { transliterateKaa, type KaaLocale } from "./kaa.js";

/**
 * Oʻzbek tili uchun yozuv:
 * - "uz-Latn"      — amaldagi lotin imlosi (oʻ, gʻ, sh, ch)
 * - "uz-Latn-2026" — 2026-yilgi yangi lotin imlosi (ö, ğ, ş, ç)
 * - "uz-Cyrl"      — kirill yozuvi
 */
export type UzLocale = "uz-Latn" | "uz-Latn-2026" | "uz-Cyrl";

export type { KaaLocale };

/**
 * Til va yozuv: oʻzbek (`uz-*`) yoki qoraqalpoq (`kaa-Latn`, `kaa-Cyrl`)
 */
export type Locale = UzLocale | KaaLocale;

export interface LocaleOptions {
  /** Natija tili va yozuvi (standart: "uz-Latn") */
  locale?: Locale;
}

export function isKaa(locale: Locale | undefined): locale is KaaLocale {
  return locale === "kaa-Latn" || locale === "kaa-Cyrl";
}

/**
 * Tilning asosiy lotin yozuvida yozilgan matnni tanlangan yozuvga oʻtkazish:
 * oʻzbekcha matn amaldagi lotin imlosida, qoraqalpoqcha matn 2016-yilgi lotinda keladi
 */
export function localize(text: string, locale: Locale = "uz-Latn"): string {
  if (locale === "uz-Latn" || locale === "kaa-Latn") return text;
  if (locale === "kaa-Cyrl") return transliterateKaa(text, locale);
  return transliterate(text, { from: "uz-Latn", to: locale });
}

/**
 * Intl bilan formatlash: kirill uchun Intl'ning oʻzi ("10 сентябр"),
 * 2026 imlosi uchun Intl'ning lotin natijasi oʻtkaziladi.
 * Intl'da qoraqalpoq tili yoʻq, shuning uchun bu funksiya faqat oʻzbekcha uchun.
 */
export function formatIntl(
  locale: UzLocale = "uz-Latn",
  format: (intlLocale: string) => string
): string {
  if (locale === "uz-Cyrl") return format("uz-Cyrl");
  return localize(format("uz-Latn"), locale);
}
