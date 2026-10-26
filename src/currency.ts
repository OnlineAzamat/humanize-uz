import { localize, type LocaleOptions } from "./locale.js";
import { wordsFor } from "./words.js";

function groupThousands(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Summani valyuta bilan ifodalash (minglik guruhlash, koʻpi bilan 2 xona kasr)
 * @example humanizeCurrency(125000) // "125 000 soʻm"
 * @example humanizeCurrency(125000, "UZS", { locale: "uz-Cyrl" }) // "125 000 сўм"
 */
export function humanizeCurrency(
  amount: number,
  currency: "UZS" | "USD" = "UZS",
  options: LocaleOptions = {}
): string {
  if (!Number.isFinite(amount)) {
    throw new RangeError(`Noto'g'ri summa: ${amount}`);
  }

  const fixed = Math.abs(amount).toFixed(2);
  // >= 1e21 uchun toFixed eksponent yozuv qaytaradi. Uning darajasidagi
  // nollarni kasr oxiridagi nollar deb olib tashlash mumkin emas.
  let formattedNumber = fixed;
  if (!fixed.includes("e")) {
    const [integer, fraction] = fixed.split(".");
    const trimmedFraction = fraction.replace(/0+$/, "");
    formattedNumber = groupThousands(integer) + (trimmedFraction ? "." + trimmedFraction : "");
  }
  const sign = amount < 0 && Number(fixed) !== 0 ? "-" : "";

  if (currency === "USD") {
    return `${sign}$${formattedNumber}`;
  }

  if (currency === "UZS") {
    // soʻm (U+02BB) belgisi bilan; qoraqalpoqcha "swm"
    const som = wordsFor(options.locale).currency.UZS[0];
    return `${sign}${formattedNumber} ${localize(som, options.locale)}`;
  }

  // Noma'lum valyuta: belgisiz son
  return `${sign}${formattedNumber}`;
}
