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
