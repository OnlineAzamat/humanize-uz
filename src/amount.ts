import { localize, type LocaleOptions } from "./locale.js";
import { integerToWords, wordsFor } from "./words.js";

export type AmountCurrency = "UZS" | "USD" | "EUR";

export interface AmountToWordsOptions extends LocaleOptions {
  /** Valyuta (standart: "UZS") */
  currency?: AmountCurrency;
  /** Kasr qismi: "digits" — "50 tiyin" (standart), "words" — "ellik tiyin" */
  fraction?: "digits" | "words";
  /** Birinchi harfni katta qilish, masalan toʻlov hujjatlari uchun */
  capitalize?: boolean;
}

/**
 * Summani soʻz bilan yozish (shartnoma, hisob-faktura, toʻlov topshiriqnomasi uchun).
 * Kasr qismi 2 xonagacha yaxlitlanadi va nol boʻlsa yozilmaydi.
 * @example amountToWords(1250000.5) // "bir million ikki yuz ellik ming soʻm 50 tiyin"
 * @example amountToWords(100, { currency: "USD" }) // "yuz dollar"
 * @example amountToWords(12.05, { fraction: "words", capitalize: true }) // "Oʻn ikki soʻm besh tiyin"
 */
export function amountToWords(amount: number, options: AmountToWordsOptions = {}): string {
  if (!Number.isFinite(amount)) {
    throw new RangeError(`Noto'g'ri summa: ${amount}`);
  }

  const [integerPart, fractionPart] = Math.abs(amount).toFixed(2).split(".");
  const integer = Number(integerPart);
  if (!Number.isSafeInteger(integer)) {
    throw new RangeError(`Summa juda katta: ${amount}`);
  }
  const fraction = Number(fractionPart);

  const lang = wordsFor(options.locale);
  const [mainUnit, fractionUnit] = lang.currency[options.currency ?? "UZS"];

  const parts = [integerToWords(integer, lang), mainUnit];
  if (fraction > 0) {
    parts.push(
      options.fraction === "words" ? integerToWords(fraction, lang) : fractionPart,
      fractionUnit
    );
  }
  // Belgi yaxlitlashdan keyin aniqlanadi: -0.001 -> "nol soʻm"
  if (amount < 0 && (integer > 0 || fraction > 0)) parts.unshift(lang.minus);

  const text = localize(parts.join(" "), options.locale);
  if (!options.capitalize) return text;
  // Qoraqalpoqcha ı ning kattasi Í
  return (text[0] === "ı" ? "Í" : text[0].toUpperCase()) + text.slice(1);
}
