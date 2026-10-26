import { localize, type LocaleOptions } from "./locale.js";
import { integerToWords, lastNumberWord, wordsFor, type LanguageWords } from "./words.js";

/**
 * Katta sonlarni qisqa ko'rinishda ifodalash
 * @example humanizeNumber(1500) // "1.5 ming"
 * @example humanizeNumber(1500, { locale: "kaa-Latn" }) // "1.5 mıń"
 */
export function humanizeNumber(n: number, options: LocaleOptions = {}): string {
  return localize(shortNumber(n, wordsFor(options.locale)), options.locale);
}

function shortNumber(n: number, lang: LanguageWords): string {
  if (!Number.isFinite(n)) throw new RangeError(`Notoʻgʻri son: ${n}`);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  // Eng katta darajadan boshlab: kvadrillion, trillion, ..., ming
  for (let i = lang.scales.length - 1; i >= 1; i--) {
    const value = 1000 ** i;
    if (abs < value) continue;
    const rounded = Math.round((abs / value) * 10) / 10;
    // 999 999 -> "1000 ming" emas, "1 million" bo'lishi kerak
    if (rounded >= 1000 && i < lang.scales.length - 1) {
      return `${sign}${Math.round((abs / (value * 1000)) * 10) / 10} ${lang.scales[i + 1]}`;
    }
    return `${sign}${rounded} ${lang.scales[i]}`;
  }
  return String(n);
}

function assertSafeInteger(n: number, fn: string): void {
  if (!Number.isSafeInteger(n)) {
    throw new RangeError(`${fn} faqat butun sonlarni qabul qiladi: ${n}`);
  }
}

/**
 * Sonni so'zlar bilan ifodalash
 * @param n Son
 * @returns So'zlar bilan ifodalangan son: "yuz yigirma uch"
 * @example numberToWords(94, { locale: "uz-Latn-2026" }) // "töqson tört"
 * @example numberToWords(94, { locale: "kaa-Latn" })     // "toqsan tórt"
 */
export function numberToWords(n: number, options: LocaleOptions = {}): string {
  assertSafeInteger(n, "numberToWords");
  return localize(integerToWords(n, wordsFor(options.locale)), options.locale);
}

/**
 * Tartib sonni so'z bilan ifodalash
 * @example ordinalToWords(1)  // "birinchi"
 * @example ordinalToWords(22) // "yigirma ikkinchi"
 * @example ordinalToWords(6, { locale: "kaa-Latn" }) // "altınshı"
 */
export function ordinalToWords(n: number, options: LocaleOptions = {}): string {
  assertSafeInteger(n, "ordinalToWords");
  if (n < 0) {
    throw new RangeError(`ordinalToWords manfiy sonlarni qabul qilmaydi: ${n}`);
  }
  const lang = wordsFor(options.locale);
  const words = integerToWords(n, lang).split(" ");
  words.push(lang.ordinal(words.pop() as string));
  return localize(words.join(" "), options.locale);
}

/**
 * Sonni tartib songa o'tkazish (masalan: 1 -> 1- yoki 1-inchi)
 * @param n Son
 * @param type 'short' (1-) yoki 'full' (1-inchi)
 */
export function humanizeOrdinal(
  n: number,
  type: "short" | "full" = "short",
  options: LocaleOptions = {}
): string {
  if (!Number.isFinite(n)) throw new RangeError(`Notoʻgʻri son: ${n}`);
  if (type === "short") {
    return `${n}-`;
  }
  // Qo'shimcha sonning oxirgi so'ziga qarab tanlanadi:
  // ikki -> ikkinchi ("2-nchi"), yigirma -> yigirmanchi ("20-nchi"), bir -> birinchi ("1-inchi")
  const lang = wordsFor(options.locale);
  const word = lastNumberWord(n, lang);
  const suffix = lang.ordinal(word).slice(word.length);
  return localize(`${n}-${suffix}`, options.locale);
}
