// Klaviaturada oʻ, gʻ va tutuq belgisi oʻrniga yoziladigan belgilar
const APOSTROPHE_RUN = /(\p{L})(['`´‘’ʻʼ]+)(?=\p{L})/gu;

const LOOKALIKES: Record<string, string> = {
  "Ș": "Ş", // Ș — rumincha vergulli S
  "ș": "ş",
  "Ǧ": "Ğ", // Ǧ — ilgakli G
  "ǧ": "ğ",
};

/**
 * Matndagi imlo belgilarini bitta kanonik shaklga keltirish:
 * - oʻ va gʻ dan keyin — ʻ (U+02BB), boshqa harflar orasida tutuq belgisi — ʼ (U+02BC)
 * - NFD (ajratilgan) shakllar NFC ga, Ș va Ǧ — Ş va Ğ ga
 * @example normalizeUz("O'zbekiston") // "Oʻzbekiston"
 * @example normalizeUz("ma'no")       // "maʼno"
 */
export function normalizeUz(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[ȘșǦǧ]/g, (ch) => LOOKALIKES[ch])
    .replace(APOSTROPHE_RUN, (_, prev: string, marks: string) => {
      if (!/[OoGg]/.test(prev)) return prev + "ʼ";
      // "mo''jiza" -> "moʻʼjiza": oʻ dan keyin tutuq belgisi
      return prev + (marks.length > 1 ? "ʻʼ" : "ʻ");
    });
}
