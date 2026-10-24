/**
 * O'zbekiston telefon raqamlarini formatlash
 * @param phone Telefon raqami (masalan: 998901234567 yoki 901234567)
 * @returns Formatlangan raqam: +998 (90) 123-45-67
 */
export function humanizePhoneNumber(phone: string | number): string {
  let cleaned = ("" + phone).replace(/\D/g, "");

  // Agar 998 bilan boshlanmasa, uni qo'shamiz
  if (cleaned.length === 9) {
    cleaned = "998" + cleaned;
  }

  if (cleaned.length !== 12) {
    return cleaned; // Noto'g'ri format bo'lsa o'zini qaytaramiz
  }

  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }

  return cleaned;
}

export type UzMobileOperator = "Beeline" | "Ucell" | "Mobiuz" | "Uzmobile" | "Humans" | "Perfectum" | "OQ";

// Mobil operator kodlari (+998 dan keyingi 2 raqam).
// Kod raqam qaysi operatorga ajratilganini bildiradi; raqam boshqa operatorga koʻchirilgan boʻlishi mumkin.
const OPERATOR_CODES: Record<string, UzMobileOperator> = {
  "90": "Beeline", "91": "Beeline",
  "93": "Ucell", "94": "Ucell", "50": "Ucell",
  "88": "Mobiuz", "97": "Mobiuz",
  "95": "Uzmobile", "99": "Uzmobile", "77": "Uzmobile",
  "33": "Humans",
  "98": "Perfectum",
  "20": "OQ",
};

// "+998 90 123 45 67", "998901234567", "901234567" -> "901234567" (milliy 9 raqam) yoki null
function nationalNumber(phone: string | number): string | null {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 9) return digits;
  if (digits.length === 12 && digits.startsWith("998")) return digits.slice(3);
  return null;
}

/**
 * Mobil raqam kodiga koʻra operatorni aniqlash
 * @example getPhoneOperator("+998 90 123 45 67") // "Beeline"
 * @example getPhoneOperator("931234567")         // "Ucell"
 * @example getPhoneOperator("712345678")         // null (shahar raqami yoki notanish kod)
 */
export function getPhoneOperator(phone: string | number): UzMobileOperator | null {
  const national = nationalNumber(phone);
  return national ? OPERATOR_CODES[national.slice(0, 2)] ?? null : null;
}

/**
 * Oʻzbekiston mobil raqamini tekshirish: 9 ta milliy raqam (yoki 998 bilan 12 ta)
 * va maʼlum operator kodi
 * @example isValidUzPhone("+998 (90) 123-45-67") // true
 * @example isValidUzPhone("+998 12 345 67 89")   // false
 */
export function isValidUzPhone(phone: string | number): boolean {
  return getPhoneOperator(phone) !== null;
}
