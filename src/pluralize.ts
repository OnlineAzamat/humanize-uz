/**
 * @deprecated O'zbek tilida sondan keyin ot birlikda qoladi: "5 kitob", "5 kitoblar" emas.
 * Shuning uchun son bilan kelgan otga ko'plik qo'shimchasi kerak emas.
 * Funksiya orqaga moslik uchun saqlangan va keyingi major versiyada olib tashlanadi.
 */
export function pluralizeUz(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
