const SIZES = ["Bayt", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

/**
 * Fayl hajmini o'qiladigan ko'rinishga keltirish
 * @example humanizeFileSize(1572864, 1) // "1.5 MB"
 */
export function humanizeFileSize(bytes: number, decimals: number = 2): string {
  if (!Number.isFinite(bytes)) {
    throw new RangeError(`Noto'g'ri fayl hajmi: ${bytes}`);
  }
  if (bytes === 0) return "0 Bayt";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sign = bytes < 0 ? "-" : "";
  const abs = Math.abs(bytes);

  const i = Math.min(Math.max(Math.floor(Math.log(abs) / Math.log(k)), 0), SIZES.length - 1);

  return sign + parseFloat((abs / Math.pow(k, i)).toFixed(dm)) + " " + SIZES[i];
}
