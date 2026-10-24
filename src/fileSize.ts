import { localize, type LocaleOptions } from "./locale.js";
import { wordsFor } from "./words.js";

const SIZES = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

/**
 * Fayl hajmini o'qiladigan ko'rinishga keltirish
 * @example humanizeFileSize(1572864, 1) // "1.5 MB"
 */
export function humanizeFileSize(
  bytes: number,
  decimals: number = 2,
  options: LocaleOptions = {}
): string {
  if (!Number.isFinite(bytes)) {
    throw new RangeError(`Noto'g'ri fayl hajmi: ${bytes}`);
  }
  const units = [wordsFor(options.locale).byte, ...SIZES];
  if (bytes === 0) return localize(`0 ${units[0]}`, options.locale);

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const abs = Math.abs(bytes);

  const i = Math.min(Math.max(Math.floor(Math.log(abs) / Math.log(k)), 0), units.length - 1);
  const value = parseFloat((abs / Math.pow(k, i)).toFixed(dm));
  // Belgi yaxlitlashdan keyin aniqlanadi: -0.001 -> "0 Bayt", "-0 Bayt" emas
  const sign = bytes < 0 && value !== 0 ? "-" : "";

  return sign + value + " " + localize(units[i], options.locale);
}
