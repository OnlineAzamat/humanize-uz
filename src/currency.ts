function groupThousands(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function humanizeCurrency(
  amount: number,
  currency: "UZS" | "USD" = "UZS"
): string {
  if (!Number.isFinite(amount)) {
    throw new RangeError(`Noto'g'ri summa: ${amount}`);
  }

  const sign = amount < 0 ? "-" : "";
  // Ko'pi bilan 2 xona kasr qismi, ortiqcha nollarsiz
  const [integer, fraction] = Math.abs(amount)
    .toFixed(2)
    .replace(/\.?0+$/, "")
    .split(".");
  // Raqamlarni 3 xonadan ajratish (faqat butun qismda)
  const formattedNumber = groupThousands(integer) + (fraction ? "." + fraction : "");

  if (currency === "USD") {
    return `${sign}$${formattedNumber}`;
  }

  // soʻm (U+02BB) belgisi bilan
  return `${sign}${formattedNumber} soʻm`;
}
