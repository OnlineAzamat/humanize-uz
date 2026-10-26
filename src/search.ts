import { transliterate } from "./transliterate.js";

// Amaldagi alifbo tartibi: A B D E F G H I J K L M N O P Q R S T U V X Y Z Oʻ Gʻ Sh Ch.
// Barcha matn avval 2026 imlosiga oʻtkaziladi (ö = oʻ, ğ = gʻ, ş = sh, ç = ch),
// shuning uchun "Oʻ", "O'", "Ö" va "Ў" bir xil oʻrinda turadi.
// Ng alohida harf sifatida saralanmaydi (2026 imlosida u alifbodan chiqarilgan).
const ORDER = "abdefghijklmnopqrstuvxyzöğşç";
const RANK = new Map([...ORDER].map((ch, i) => [ch, i]));

function sortKey(text: string): number[] {
  const pivot = transliterate(text, { to: "uz-Latn-2026" }).toLowerCase();
  return [...pivot].map((ch) => {
    const rank = RANK.get(ch);
    // Alifbodan tashqari belgilar (raqamlar, boʻsh joy) harflardan oldin, kod nuqtasi boʻyicha;
    // tutuq belgisi eʼtiborga olinmaydi
    if (ch === "ʼ") return -1;
    return rank === undefined ? -100000 + (ch.codePointAt(0) as number) / 100000 : rank;
  }).filter((r) => r !== -1);
}

/**
 * Oʻzbek alifbosi tartibida solishtirish (Array.prototype.sort uchun).
 * Lotin, 2026 lotin va kirill yozuvlarini birga saralaydi.
 * @example ["shahar", "choy", "olma", "oʻrik"].sort(compareUz) // ["olma", "oʻrik", "shahar", "choy"]
 */
export function compareUz(a: string, b: string): number {
  const ka = sortKey(a);
  const kb = sortKey(b);
  const length = Math.min(ka.length, kb.length);
  for (let i = 0; i < length; i++) {
    if (ka[i] !== kb[i]) return ka[i] < kb[i] ? -1 : 1;
  }
  return ka.length - kb.length;
}

export interface SearchKeyOptions {
  /**
   * Yumshoq moslash: diakritik va apostroflarsiz yozilgan soʻrovni ham topish
   * ("ozbek" -> "Oʻzbek"). Bunda ö -> o, ğ -> g, ş -> sh, ç -> ch.
   */
  loose?: boolean;
}

/**
 * Qidiruv kaliti: bir soʻzning turli imlo va yozuvdagi shakllari bitta kalitga keladi.
 * Saqlangan matn va qidiruv soʻrovi uchun bir xil kalit hisoblanib solishtiriladi.
 * @example searchKey("Oʻzbekiston") === searchKey("O'zbekiston") // true
 * @example searchKey("Özbekiston") === searchKey("Ўзбекистон")   // true
 * @example searchKey("ozbekiston", { loose: true }) === searchKey("Oʻzbekiston", { loose: true }) // true
 */
export function searchKey(text: string, options: SearchKeyOptions = {}): string {
  const key = transliterate(text, { to: "uz-Latn-2026" }).toLowerCase();
  if (!options.loose) return key;
  return key
    .replace(/ʼ/g, "")
    .replace(/ö/g, "o")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "sh")
    .replace(/ç/g, "ch");
}
