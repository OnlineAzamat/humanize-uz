const SHORT_SCALES: [number, string][] = [
  [1e15, "kvadrillion"],
  [1e12, "trillion"],
  [1e9, "milliard"],
  [1e6, "million"],
  [1e3, "ming"],
];

/**
 * Katta sonlarni qisqa ko'rinishda ifodalash
 * @example humanizeNumber(1500) // "1.5 ming"
 */
export function humanizeNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  for (let i = 0; i < SHORT_SCALES.length; i++) {
    const [value, name] = SHORT_SCALES[i];
    if (abs < value) continue;
    const rounded = Math.round((abs / value) * 10) / 10;
    // 999 999 -> "1000 ming" emas, "1 million" bo'lishi kerak
    if (rounded >= 1000 && i > 0) {
      const [upValue, upName] = SHORT_SCALES[i - 1];
      return `${sign}${Math.round((abs / upValue) * 10) / 10} ${upName}`;
    }
    return `${sign}${rounded} ${name}`;
  }
  return String(n);
}

const ONES = ["", "bir", "ikki", "uch", "to\u02BBrt", "besh", "olti", "yetti", "sakkiz", "to\u02BBqqiz"];
const TENS = ["", "o\u02BBn", "yigirma", "o\u02BBttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to\u02BBqson"];
const SCALES = ["", "ming", "million", "milliard", "trillion", "kvadrillion"];

/**
 * Sonni so'zlar bilan ifodalash
 * @param n Son
 * @returns So'zlar bilan ifodalangan son: "yuz yigirma uch"
 */
export function numberToWords(n: number): string {
  if (!Number.isSafeInteger(n)) {
    throw new RangeError(`numberToWords faqat butun sonlarni qabul qiladi: ${n}`);
  }
  if (n === 0) return "nol";
  if (n < 0) return "minus " + numberToWords(Math.abs(n));

  let words = "";

  function convertGroup(num: number): string {
    let groupWords = "";
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    const tens = Math.floor(remainder / 10);
    const ones = remainder % 10;

    if (hundreds > 0) {
      groupWords += (hundreds === 1 ? "" : ONES[hundreds] + " ") + "yuz ";
    }
    if (tens > 0) {
      groupWords += TENS[tens] + " ";
    }
    if (ones > 0) {
      groupWords += ONES[ones] + " ";
    }

    return groupWords.trim();
  }

  let scaleIndex = 0;
  let tempN = n;

  while (tempN > 0) {
    const group = tempN % 1000;
    if (group > 0) {
      const groupWords = convertGroup(group);
      words = groupWords + (SCALES[scaleIndex] ? " " + SCALES[scaleIndex] : "") + " " + words;
    }
    tempN = Math.floor(tempN / 1000);
    scaleIndex++;
  }

  return words.trim();
}

/**
 * Sonni tartib songa o'tkazish (masalan: 1 -> 1- yoki 1-chi)
 * @param n Son
 * @param type 'short' (1-) yoki 'full' (1-inchi)
 */
export function humanizeOrdinal(n: number, type: "short" | "full" = "short"): string {
  if (type === "short") {
    return `${n}-`;
  }

  // O'zbek tilida tartib sonlar:
  // 0 - inchi
  // 1 - inchi
  // 2 - nchi (unli bilan tugaganligi sababli)
  // 3 - inchi
  // 4 - inchi
  // 5 - nchi (unli bilan tugaganligi sababli)
  // 6 - nchi (unli bilan tugaganligi sababli)
  // 7 - nchi (unli bilan tugaganligi sababli)
  // 8 - inchi
  // 9 - inchi
  // 10 - inchi
  // 20 - nchi
  // 30 - inchi
  // 40 - inchi
  // 50 - inchi
  // 60 - inchi
  // 70 - inchi
  // 80 - inchi
  // 90 - inchi

  // Qisqa qoida: Agar son unli bilan tugasa "-nchi", undosh bilan bo'lsa "-inchi"
  // Unli bilan tugaydigan sonlar: 2 (ikki), 5 (besh? yo'q, h - undosh), 6 (olti), 7 (yetti), 20 (yigirma), 50 (ellik? yo'q), 80 (sakson? yo'q)
  // Aslida sonlarning so'z bilan ifodalanishiga qaraymiz:
  // 1 - bir (r - undosh) -> inchi
  // 2 - ikki (i - unli) -> nchi
  // 3 - uch (ch - undosh) -> inchi
  // 4 - to'rt (t - undosh) -> inchi
  // 5 - besh (sh - undosh) -> inchi
  // 6 - olti (i - unli) -> nchi
  // 7 - yetti (i - unli) -> nchi
  // 8 - sakkiz (z - undosh) -> inchi
  // 9 - to'qqiz (z - undosh) -> inchi
  // 10 - o'n (n - undosh) -> inchi
  // 20 - yigirma (a - unli) -> nchi
  // 30 - o'ttiz (z - undosh) -> inchi
  // 40 - qirq (q - undosh) -> inchi
  // 50 - ellik (k - undosh) -> inchi
  // 60 - oltmish (sh - undosh) -> inchi
  // 70 - yetmish (sh - undosh) -> inchi
  // 80 - sakson (n - undosh) -> inchi
  // 90 - to'qson (n - undosh) -> inchi
  // 100 - yuz (z - undosh) -> inchi

  // Birliklar: ikki, olti, yetti; o'nliklar: yigirma — unli bilan tugaydi
  const vowels = [2, 6, 7];

  // Murakkab sonlar uchun (masalan 22), oxirgi qismi muhim
  const abs = Math.abs(n);
  if (vowels.includes(abs % 10) || abs % 100 === 20) {
    return `${n}-nchi`;
  }

  return `${n}-inchi`;
}