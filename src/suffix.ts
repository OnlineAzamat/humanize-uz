import { localize, isKaa, type LocaleOptions } from "./locale.js";
import { transliterate } from "./transliterate.js";
import { lastNumberWord, uz } from "./words.js";

// Lex.uz, 37-qoida: https://lex.uz/docs/-1625271
// k -> -ka/-kacha, q -> -qa/-qacha; boshqa hollarda g saqlanadi.
const ASSIMILATING = new Set(["ga", "gacha"]);

function assimilate(lastWord: string, suffix: string): string {
  if (!ASSIMILATING.has(suffix)) return suffix;
  const word = lastWord.toLowerCase();
  if (/q$/.test(word)) return "q" + suffix.slice(1);
  if (/k$/.test(word)) return "k" + suffix.slice(1);
  return suffix;
}

/**
 * Soʻz yoki songa qoʻshimcha qoʻshish (imlo qoidasiga koʻra -ga/-ka/-qa).
 * Songa qoʻshimcha chiziqcha bilan yoziladi va sonning oʻqilishiga qarab tanlanadi:
 * 50 — "ellik" -> "50-ka", 40 — "qirq" -> "40-qa".
 * Qoʻshimcha amaldagi lotin imlosida beriladi ("ga", "da", "dan", "ni", "ning", "gacha" ...),
 * natija esa `locale` yozuvida qaytadi.
 * @example addSuffix("bank", "ga")      // "bankka"
 * @example addSuffix("qishloq", "ga")   // "qishloqqa"
 * @example addSuffix("maktab", "ga")    // "maktabga"
 * @example addSuffix(50, "ga")          // "50-ka"
 * @example addSuffix(2026, "da")        // "2026-da"
 * @example addSuffix("банк", "ga", { locale: "uz-Cyrl" }) // "банкка"
 */
export function addSuffix(word: string | number, suffix: string, options: LocaleOptions = {}): string {
  if (isKaa(options.locale)) {
    throw new RangeError("addSuffix hozircha faqat oʻzbek tilini qoʻllab-quvvatlaydi");
  }
  const bare = suffix.replace(/^-/, "");

  if (typeof word === "number") {
    if (!Number.isFinite(word)) throw new RangeError(`Notoʻgʻri son: ${word}`);
    const chosen = assimilate(lastNumberWord(word, uz), bare);
    return `${word}-${localize(chosen, options.locale)}`;
  }

  // Asosni ham tanlangan yozuvga o'tkazamiz; qoida uchun amaldagi lotin ishlatiladi.
  const latin = transliterate(word, { to: "uz-Latn" });
  const chosen = assimilate(latin.replace(/[^\p{L}ʻ]+$/u, ""), bare);
  return localize(latin + chosen, options.locale);
}
