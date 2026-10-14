import { localize, type LocaleOptions } from "./locale.js";

function groupThousands(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function humanizeCurrency(
  amount: number,
  currency: "UZS" | "USD" = "UZS",
  options: LocaleOptions = {}
): string {
  if (!Number.isFinite(amount)) {
    throw new RangeError(`Noto'g'ri summa: ${amount}`);
  }

  // Ko'pi bilan 2 xona kasr qismi, ortiqcha nollarsiz
  const [integer, fraction] = Math.abs(amount)
    .toFixed(2)
    .replace(/\.?0+$/, "")
    .split(".");
  // Belgi yaxlitlashdan keyin aniqlanadi: -0.001 -> "0", "-0" emas
  const sign = amount < 0 && (integer !== "0" || fraction) ? "-" : "";
  // Raqamlarni 3 xonadan ajratish (faqat butun qismda)
  const formattedNumber = groupThousands(integer) + (fraction ? "." + fraction : "");

  if (currency === "USD") {
    return `${sign}$${formattedNumber}`;
  }

  if (currency === "UZS") {
    // soʻm (U+02BB) belgisi bilan
    return `${sign}${formattedNumber} ${localize("soʻm", options.locale)}`;
  }

  // Noma'lum valyuta: belgisiz son
  return `${sign}${formattedNumber}`;
}
