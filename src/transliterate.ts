import type { UzLocale } from "./locale.js";
import { normalizeUz } from "./normalize.js";

// Barcha oʻtkazishlar 2026-yilgi lotin imlosi orqali bajariladi: unda har bir
// tovush bitta harf (ş, ç, ö, ğ), "sh" esa doim ikki alohida harf (Ishoq).

function isUpper(ch: string | undefined): boolean {
  return ch !== undefined && ch !== ch.toLowerCase();
}

function isLetter(ch: string | undefined): boolean {
  return ch !== undefined && /\p{L}/u.test(ch);
}

// Bir harf bir necha harfga aylanganda: "Ш" -> "Sh", lekin "ШАҲАР" -> "SHAHAR"
function applyCase(out: string, upper: boolean, prev?: string, next?: string): string {
  if (!upper) return out;
  if (out.length < 2) return out.toUpperCase();
  const allCaps = isLetter(next) ? isUpper(next) : isUpper(prev);
  return allCaps ? out.toUpperCase() : out[0].toUpperCase() + out.slice(1);
}

const LATN_TO_PIVOT: Record<string, string> = { sh: "ş", ch: "ç", "oʻ": "ö", "gʻ": "ğ" };

function latnToPivot(text: string): string {
  return text.replace(/sʼh|sh|ch|[og]ʻ/giu, (m) => {
    const lower = m.toLowerCase();
    // "Isʼhoq" -> "Ishoq": yangi imloda tutuq belgisi kerak emas
    if (lower === "sʼh") return m[0] + m[2];
    const out = LATN_TO_PIVOT[lower];
    return isUpper(m[0]) ? out.toUpperCase() : out;
  });
}

const PIVOT_TO_LATN: Record<string, string> = { ş: "sh", ç: "ch", ö: "oʻ", ğ: "gʻ" };

function pivotToLatn(text: string): string {
  return text.replace(/s(?=h)|[şçöğ]/giu, (ch: string, offset: number) => {
    const lower = ch.toLowerCase();
    if (lower === "s") return ch + "ʼ";
    return applyCase(PIVOT_TO_LATN[lower], isUpper(ch), text[offset - 1], text[offset + 1]);
  });
}

const CYRL_TO_PIVOT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ё: "yo", ж: "j", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "x", ч: "ç", ш: "ş", щ: "ş", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
  ў: "ö", қ: "q", ғ: "ğ", ҳ: "h",
};
const CYRL_VOWELS = "аеёиоуэюяўы";
const CYRILLIC = /[Ѐ-ӿ]/;

function cyrlToPivot(text: string): string {
  return text.replace(/[Ѐ-ӿ]/gu, (ch: string, offset: number) => {
    const lower = ch.toLowerCase();
    const prev = text[offset - 1]?.toLowerCase();
    const next = text[offset + 1]?.toLowerCase();
    let out: string;
    if (lower === "е") {
      // Soʻz boshida va unlidan keyin "ye": "ер" -> "yer", "объект" -> "obyekt"
      const afterVowel = prev !== undefined && (CYRL_VOWELS + "ъь").includes(prev);
      out = prev === undefined || !CYRILLIC.test(prev) || afterVowel ? "ye" : "e";
    } else if (lower === "ц") {
      // Unlidan keyin "ts", qolgan hollarda "s": "милиция" -> "militsiya", "цирк" -> "sirk"
      out = prev !== undefined && CYRL_VOWELS.includes(prev) ? "ts" : "s";
    } else if (lower === "ъ") {
      out = next !== undefined && "еёюя".includes(next) ? "" : "ʼ";
    } else {
      out = CYRL_TO_PIVOT[lower] ?? ch;
    }
    return applyCase(out, isUpper(ch), text[offset - 1], text[offset + 1]);
  });
}

const PIVOT_TO_CYRL: Record<string, string> = {
  a: "а", b: "б", c: "ц", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж",
  k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ", r: "р", s: "с", t: "т",
  u: "у", v: "в", w: "в", x: "х", y: "й", z: "з", ö: "ў", ğ: "ғ", ş: "ш", ç: "ч",
  "ʼ": "ъ",
};
const IOTATED: Record<string, string> = { yo: "ё", yu: "ю", ya: "я", ye: "е" };
const LATN_VOWELS = "aeiouö";

function isConsonant(ch: string | undefined): boolean {
  return ch !== undefined && ch in PIVOT_TO_CYRL && !LATN_VOWELS.includes(ch) && ch !== "y";
}

function pivotToCyrl(text: string): string {
  return text.replace(/y[oaue]|[a-zöğşçʼ]/giu, (m: string, offset: number) => {
    const lower = m.toLowerCase();
    const prev = text[offset - 1]?.toLowerCase();
    let out: string;
    if (lower.length === 2) {
      // "obyekt" -> "объект"
      out = lower === "ye" && isConsonant(prev) && prev !== "ʼ" ? "ъе" : IOTATED[lower];
    } else if (lower === "e") {
      // Soʻz boshida va unlidan keyin "э": "eshik" -> "эшик", "poeziya" -> "поэзия"
      out = isConsonant(prev) ? "е" : "э";
    } else {
      out = PIVOT_TO_CYRL[lower];
    }
    return isUpper(m[0]) ? out.toUpperCase() : out;
  });
}

const LATN_2026_LETTERS = /[öğşçÖĞŞÇ]/;

/**
 * Matn qaysi yozuv va imloda yozilganini aniqlash
 * @example detectScript("Шаҳар")  // "uz-Cyrl"
 * @example detectScript("Şahar")  // "uz-Latn-2026"
 * @example detectScript("Shahar") // "uz-Latn"
 */
export function detectScript(text: string): UzLocale {
  const normalized = normalizeUz(text);
  const cyrl = normalized.match(/[Ѐ-ӿ]/g)?.length ?? 0;
  const latn = normalized.match(/[A-Za-zÀ-ɏ]/g)?.length ?? 0;
  if (cyrl > latn) return "uz-Cyrl";
  return LATN_2026_LETTERS.test(normalized) ? "uz-Latn-2026" : "uz-Latn";
}

export interface TransliterateOptions {
  /** Natija yozuvi */
  to: UzLocale;
  /** Lotin qismlar imlosi; berilmasa matndan aniqlanadi. Kirill harflari doim kirill deb olinadi. */
  from?: UzLocale;
}

/**
 * Matnni amaldagi lotin, 2026-yilgi lotin va kirill yozuvlari orasida oʻtkazish
 * @example transliterate("Oʻzbekiston", { to: "uz-Latn-2026" }) // "Özbekiston"
 * @example transliterate("Шаҳар", { to: "uz-Latn" })            // "Shahar"
 * @example transliterate("choʻqqi", { to: "uz-Cyrl" })          // "чўққи"
 */
export function transliterate(text: string, options: TransliterateOptions): string {
  const normalized = normalizeUz(text);
  const latinFrom =
    options.from && options.from !== "uz-Cyrl"
      ? options.from
      : LATN_2026_LETTERS.test(normalized) ? "uz-Latn-2026" : "uz-Latn";

  // Avval lotin, keyin kirill: kirilldan chiqqan "sh" (сҳ) qayta "ş" ga aylanmasligi uchun
  const pivot = cyrlToPivot(latinFrom === "uz-Latn" ? latnToPivot(normalized) : normalized);

  if (options.to === "uz-Latn-2026") return pivot;
  if (options.to === "uz-Latn") return pivotToLatn(pivot);
  return pivotToCyrl(pivot);
}
