import { localize, isKaa, type LocaleOptions } from "./locale.js";
import { transliterate } from "./transliterate.js";
import { lastNumberWord, uz } from "./words.js";

// Imlo qoidasi: -ga va -gacha qoʻshimchalari
// k yoki g bilan tugagan soʻzga -ka/-kacha (bankka, bargka),
// q yoki gʻ bilan tugagan soʻzga -qa/-qacha (qishloqqa, bogʻqa) shaklida qoʻshiladi;
// ng bilan tugagan soʻzga oʻzgarishsiz: tongga.
const ASSIMILATING = new Set(["ga", "gacha"]);

function assimilate(lastWord: string, suffix: string): string {
  if (!ASSIMILATING.has(suffix)) return suffix;
  const word = lastWord.toLowerCase();
  if (/(gʻ|q)$/.test(word)) return "q" + suffix.slice(1);
  // "ng" bitta tovush: tongga, mingga
  if (/k$|(?<!n)g$/.test(word)) return "k" + suffix.slice(1);
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

  // Soʻz qaysi yozuvda boʻlmasin, oxirgi harfi amaldagi lotin imlosida tekshiriladi
  // Soʻz oxiridagi apostrof ("bog'") normalizeUz tomonidan tuzatilmaydi: u faqat harflar orasida ishlaydi
  const ending = word.replace(/([GgOo])['`´‘’ʼ]$/u, "$1ʻ");
  const latin = transliterate(ending, { to: "uz-Latn" }).replace(/[^\p{L}ʻ]+$/u, "");
  const chosen = assimilate(latin, bare);
  return word + localize(chosen, options.locale);
}
