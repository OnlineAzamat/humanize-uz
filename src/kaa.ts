// Qoraqalpoq tili: 2016-yilgi lotin alifbosi (Á Ǵ Í Ń Ó Ú, Sh, C, Ch) va kirill yozuvi.
// Í ning kichigi nuqtasiz ı (U+0131), shuning uchun JavaScript'ning toUpperCase()
// va toLowerCase() funksiyalari bu harfni buzadi: "ı" -> "I", "Í" -> "í".

/**
 * Qoraqalpoqcha matnni katta harflarga oʻtkazish (ı -> Í)
 * @example toUpperKaa("qaraqalpaqstan") // "QARAQALPAQSTAN"
 * @example toUpperKaa("altı")           // "ALTÍ"
 */
export function toUpperKaa(text: string): string {
  return text.replace(/ı/g, "Í").toUpperCase();
}

/**
 * Qoraqalpoqcha matnni kichik harflarga oʻtkazish (Í -> ı)
 * @example toLowerKaa("ALTÍ") // "altı"
 */
export function toLowerKaa(text: string): string {
  return text.replace(/Í/g, "ı").toLowerCase();
}

// 2016-yilgacha ishlatilgan apostrofli harflar: A' O' U' G' N'
const APOSTROPHE_LETTER = /([AaOoUuGgNn])['`´‘’ʻʼ]/g;
const ACUTE: Record<string, string> = {
  A: "Á", a: "á", O: "Ó", o: "ó", U: "Ú", u: "ú", G: "Ǵ", g: "ǵ", N: "Ń", n: "ń",
};

/**
 * Qoraqalpoqcha lotin matnini 2016-yilgi alifbo belgilariga keltirish:
 * - NFD (ajratilgan) shakllar NFC ga
 * - kichik í (U+00ED) va ı́ — ı (U+0131) ga
 * - eski apostrofli harflar (A', O', U', G', N') — Á, Ó, Ú, Ǵ, Ń ga
 * @example normalizeKaa("o'zbek") // "ózbek"
 * @example normalizeKaa("altí")   // "altı"
 */
export function normalizeKaa(text: string): string {
  return text
    .normalize("NFC")
    .replace(/ı́|í/g, "ı")
    .replace(APOSTROPHE_LETTER, (_, letter: string) => ACUTE[letter]);
}

function isUpper(ch: string | undefined): boolean {
  return ch !== undefined && ch !== ch.toLowerCase();
}

function isLetter(ch: string | undefined): boolean {
  return ch !== undefined && /\p{L}/u.test(ch);
}

// Bir harf ikki harfga aylanganda: "Ш" -> "Sh", lekin "ШАҲАР" -> "SHAHAR"
function applyCase(out: string, upper: boolean, prev?: string, next?: string): string {
  if (!upper) return out;
  if (out.length < 2) return toUpperKaa(out);
  const allCaps = isLetter(next) ? isUpper(next) : isUpper(prev);
  return allCaps ? toUpperKaa(out) : toUpperKaa(out[0]) + out.slice(1);
}

const CYRL_TO_LATN: Record<string, string> = {
  а: "a", ә: "á", б: "b", в: "v", г: "g", ғ: "ǵ", д: "d", е: "e", ё: "yo", ж: "j",
  з: "z", и: "i", й: "y", к: "k", қ: "q", л: "l", м: "m", н: "n", ң: "ń", о: "o",
  ө: "ó", п: "p", р: "r", с: "s", т: "t", у: "u", ү: "ú", ў: "w", ф: "f", х: "x",
  ҳ: "h", ц: "c", ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "ı", ь: "", э: "e", ю: "yu",
  я: "ya",
};

function cyrlToLatn(text: string): string {
  return text.replace(/[Ѐ-ӿ]/gu, (ch: string, offset: number) => {
    const out = CYRL_TO_LATN[ch.toLowerCase()] ?? ch;
    return applyCase(out, isUpper(ch), text[offset - 1], text[offset + 1]);
  });
}

const LATN_TO_CYRL: Record<string, string> = {
  a: "а", á: "ә", b: "б", c: "ц", d: "д", e: "е", f: "ф", g: "г", ǵ: "ғ", h: "ҳ",
  i: "и", ı: "ы", j: "ж", k: "к", l: "л", m: "м", n: "н", ń: "ң", o: "о", ó: "ө",
  p: "п", q: "қ", r: "р", s: "с", t: "т", u: "у", ú: "ү", v: "в", w: "ў", x: "х",
  y: "й", z: "з", sh: "ш", ch: "ч", ya: "я", yu: "ю", yo: "ё",
};

function latnToCyrl(text: string): string {
  // Í alohida yoziladi: "i" bayrogʻi uni ı ga emas, í ga moslaydi
  return text.replace(/sh|ch|y[aou]|[a-záǵıńóúÍ]/giu, (m: string) => {
    const out = LATN_TO_CYRL[toLowerKaa(m)];
    if (out === undefined) return m;
    return isUpper(m[0]) ? out.toUpperCase() : out;
  });
}

/** Qoraqalpoq tili uchun yozuv */
export type KaaLocale = "kaa-Latn" | "kaa-Cyrl";

/**
 * Qoraqalpoqcha matnni lotin va kirill yozuvlari orasida oʻtkazish.
 * Kirill harflari lotinga, lotin harflari (to: "kaa-Cyrl" boʻlsa) kirillga oʻtkaziladi.
 * @example transliterateKaa("Қарақалпақстан", "kaa-Latn") // "Qaraqalpaqstan"
 * @example transliterateKaa("Nókis", "kaa-Cyrl")          // "Нөкис"
 */
export function transliterateKaa(text: string, to: KaaLocale): string {
  const latn = cyrlToLatn(normalizeKaa(text));
  return to === "kaa-Latn" ? latn : latnToCyrl(latn);
}
