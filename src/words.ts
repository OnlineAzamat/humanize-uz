import { isKaa, type Locale } from "./locale.js";

export type TimeUnit = "second" | "minute" | "hour" | "day";

/**
 * Tilga xos soʻzlar. Oʻzbekcha soʻzlar amaldagi lotin imlosida,
 * qoraqalpoqcha soʻzlar 2016-yilgi lotin alifbosida yoziladi;
 * boshqa yozuvlarga `localize()` oʻtkazadi.
 */
export interface LanguageWords {
  zero: string;
  minus: string;
  hundred: string;
  ones: string[];
  tens: string[];
  /** 1000 ning darajalari: ["", "ming", "million", ...] */
  scales: string[];
  /** Sanoq son soʻzidan tartib son soʻzi: "ikki" -> "ikkinchi" */
  ordinal(word: string): string;
  now: string;
  today: string;
  yesterday: string;
  tomorrow: string;
  past(amount: number, unit: TimeUnit): string;
  future(amount: number, unit: TimeUnit): string;
  months: string[];
  and: string;
  currency: Record<"UZS" | "USD" | "EUR", [main: string, fraction: string]>;
  byte: string;
}

const UZ_UNITS: Record<TimeUnit, string> = {
  second: "soniya",
  minute: "daqiqa",
  hour: "soat",
  day: "kun",
};

export const uz: LanguageWords = {
  zero: "nol",
  minus: "minus",
  hundred: "yuz",
  ones: ["", "bir", "ikki", "uch", "toʻrt", "besh", "olti", "yetti", "sakkiz", "toʻqqiz"],
  tens: ["", "oʻn", "yigirma", "oʻttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "toʻqson"],
  scales: ["", "ming", "million", "milliard", "trillion", "kvadrillion"],
  // Unli bilan tugasa "-nchi" (ikkinchi, yigirmanchi), undosh bilan tugasa "-inchi" (birinchi)
  ordinal: (word) => word + (/[aeiou]$/.test(word) ? "nchi" : "inchi"),
  now: "hozirgina",
  today: "bugun",
  yesterday: "kecha",
  tomorrow: "ertaga",
  past: (amount, unit) => `${amount} ${UZ_UNITS[unit]} oldin`,
  future: (amount, unit) => `${amount} ${UZ_UNITS[unit]}dan keyin`,
  months: [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
  ],
  and: "va",
  currency: {
    UZS: ["soʻm", "tiyin"],
    USD: ["dollar", "sent"],
    EUR: ["yevro", "sent"],
  },
  byte: "Bayt",
};

// TAJRIBAVIY: qoraqalpoqcha soʻzlar ona tilida soʻzlashuvchi tomonidan hali tasdiqlanmagan.
// Tekshirilishi kerak boʻlgan joylar README'dagi "Qoraqalpoq tili" boʻlimida sanab oʻtilgan.

const KAA_UNITS: Record<TimeUnit, [word: string, ablative: string]> = {
  second: ["sekund", "sekundtan"],
  minute: ["minut", "minuttan"],
  hour: ["saat", "saattan"],
  day: ["kún", "kúnnen"],
};

const KAA_BACK_VOWELS = "aouı";
const KAA_VOWELS = "aouıáóúie";

// Unli uygʻunligi: oxirgi unli orqa qator (a, o, u, ı) boʻlsa "-ınshı", old qator boʻlsa "-inshi";
// soʻz unli bilan tugasa "ı/i" tushib qoladi: eki -> ekinshi, altı -> altınshı
function kaaOrdinal(word: string): string {
  const lastVowel = [...word].reverse().find((ch) => KAA_VOWELS.includes(ch));
  const back = lastVowel !== undefined && KAA_BACK_VOWELS.includes(lastVowel);
  const endsWithVowel = KAA_VOWELS.includes(word.slice(-1));
  const suffix = back ? "ınshı" : "inshi";
  return word + (endsWithVowel ? suffix.slice(1) : suffix);
}

export const kaa: LanguageWords = {
  zero: "nol",
  minus: "minus",
  hundred: "júz",
  ones: ["", "bir", "eki", "úsh", "tórt", "bes", "altı", "jeti", "segiz", "toǵız"],
  tens: ["", "on", "jigirma", "otız", "qırıq", "eliw", "alpıs", "jetpis", "seksen", "toqsan"],
  scales: ["", "mıń", "million", "milliard", "trillion", "kvadrillion"],
  ordinal: kaaOrdinal,
  now: "házir",
  today: "búgin",
  yesterday: "keshe",
  tomorrow: "erteń",
  past: (amount, unit) => `${amount} ${KAA_UNITS[unit][0]} burın`,
  future: (amount, unit) => `${amount} ${KAA_UNITS[unit][1]} keyin`,
  months: [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr",
  ],
  and: "hám",
  currency: {
    UZS: ["swm", "tıyın"],
    USD: ["dollar", "cent"],
    EUR: ["evro", "cent"],
  },
  byte: "Bayt",
};

export function wordsFor(locale: Locale | undefined): LanguageWords {
  return isKaa(locale) ? kaa : uz;
}

/** Butun sonni soʻz bilan yozish (tilning asosiy lotin yozuvida) */
export function integerToWords(n: number, lang: LanguageWords): string {
  if (n === 0) return lang.zero;
  if (n < 0) return `${lang.minus} ${integerToWords(-n, lang)}`;

  const group = (num: number): string[] => {
    const hundreds = Math.floor(num / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;
    const out: string[] = [];
    if (hundreds > 0) {
      if (hundreds > 1) out.push(lang.ones[hundreds]);
      out.push(lang.hundred);
    }
    if (tens > 0) out.push(lang.tens[tens]);
    if (ones > 0) out.push(lang.ones[ones]);
    return out;
  };

  const words: string[] = [];
  for (let scale = 0, rest = n; rest > 0; scale++, rest = Math.floor(rest / 1000)) {
    const num = rest % 1000;
    if (num === 0) continue;
    words.unshift(...group(num), ...(scale > 0 ? [lang.scales[scale]] : []));
  }
  return words.join(" ");
}

/** Sanoq sonning oxirgi soʻzi (tartib qoʻshimchasini tanlash uchun) */
export function lastNumberWord(n: number, lang: LanguageWords): string {
  const abs = Math.abs(Math.trunc(n));
  if (abs === 0) return lang.zero;
  const group = abs % 1000;
  // 1000, 2 000 000 kabi: oxirgi soʻz daraja nomi ("ming", "million"...)
  if (group === 0) return lang.scales[1];
  return integerToWords(group, lang).split(" ").pop() as string;
}
