import { formatIntl, localize, type LocaleOptions } from "./locale.js";

const DAY_MS = 86_400_000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function toDate(input: string | number | Date): Date {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Noto'g'ri sana: ${String(input)}`);
  }
  return date;
}

/**
 * Sanani kalendar kunlari bo'yicha ifodalash
 * @example humanizeDate(new Date()) // "bugun"
 */
export function humanizeDate(input: string | number | Date, options: LocaleOptions = {}): string {
  const date = toDate(input);
  const relative = relativeDay(date);
  if (relative !== null) return localize(relative, options.locale);
  return formatIntl(options.locale, (locale) => date.toLocaleDateString(locale));
}

function relativeDay(date: Date): string | null {
  const diff = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY_MS);

  if (diff === 0) return "bugun";
  if (diff === 1) return "kecha";
  if (diff === -1) return "ertaga";
  if (diff > 0 && diff < 7) return `${diff} kun oldin`;
  if (diff < 0 && diff > -7) return `${-diff} kundan keyin`;
  return null;
}

/**
 * Hozirgi vaqtga nisbatan o'tgan (yoki qolgan) vaqt
 * @example timeAgo(new Date(Date.now() - 3600 * 1000)) // "1 soat oldin"
 */
export function timeAgo(input: string | number | Date, options: LocaleOptions = {}): string {
  const date = toDate(input);
  const relative = relativeTime(date);
  if (relative !== null) return localize(relative, options.locale);
  return formatIntl(options.locale, (locale) => date.toLocaleDateString(locale));
}

function relativeTime(date: Date): string | null {
  const diffMs = Date.now() - date.getTime();
  const future = diffMs < 0;
  const seconds = Math.floor(Math.abs(diffMs) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 5) return "hozirgina";

  let amount: number;
  let unit: string;
  if (seconds < 60) [amount, unit] = [seconds, "soniya"];
  else if (minutes < 60) [amount, unit] = [minutes, "daqiqa"];
  else if (hours < 24) [amount, unit] = [hours, "soat"];
  else if (days < 7) [amount, unit] = [days, "kun"];
  else return null;

  return future ? `${amount} ${unit}dan keyin` : `${amount} ${unit} oldin`;
}
