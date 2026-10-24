import { formatIntl, isKaa, localize, type Locale, type LocaleOptions } from "./locale.js";
import { wordsFor, type LanguageWords, type TimeUnit } from "./words.js";

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

const pad2 = (n: number) => String(n).padStart(2, "0");

// Intl'da qoraqalpoq tili yoʻq: sana "dd.mm.yyyy" koʻrinishida yoziladi
function formatShortDate(date: Date, locale: Locale | undefined): string {
  if (isKaa(locale)) {
    return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()}`;
  }
  return formatIntl(locale, (intlLocale) => date.toLocaleDateString(intlLocale));
}

/**
 * Sanani kalendar kunlari bo'yicha ifodalash
 * @example humanizeDate(new Date()) // "bugun"
 */
export function humanizeDate(input: string | number | Date, options: LocaleOptions = {}): string {
  const date = toDate(input);
  const relative = relativeDay(date, wordsFor(options.locale));
  if (relative !== null) return localize(relative, options.locale);
  return formatShortDate(date, options.locale);
}

function relativeDay(date: Date, lang: LanguageWords): string | null {
  const diff = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY_MS);

  if (diff === 0) return lang.today;
  if (diff === 1) return lang.yesterday;
  if (diff === -1) return lang.tomorrow;
  if (diff > 0 && diff < 7) return lang.past(diff, "day");
  if (diff < 0 && diff > -7) return lang.future(-diff, "day");
  return null;
}

/**
 * Hozirgi vaqtga nisbatan o'tgan (yoki qolgan) vaqt
 * @example timeAgo(new Date(Date.now() - 3600 * 1000)) // "1 soat oldin"
 */
export function timeAgo(input: string | number | Date, options: LocaleOptions = {}): string {
  const date = toDate(input);
  const relative = relativeTime(date, wordsFor(options.locale));
  if (relative !== null) return localize(relative, options.locale);
  return formatShortDate(date, options.locale);
}

function relativeTime(date: Date, lang: LanguageWords): string | null {
  const diffMs = Date.now() - date.getTime();
  const future = diffMs < 0;
  const seconds = Math.floor(Math.abs(diffMs) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 5) return lang.now;

  let amount: number;
  let unit: TimeUnit;
  if (seconds < 60) [amount, unit] = [seconds, "second"];
  else if (minutes < 60) [amount, unit] = [minutes, "minute"];
  else if (hours < 24) [amount, unit] = [hours, "hour"];
  else if (days < 7) [amount, unit] = [days, "day"];
  else return null;

  return future ? lang.future(amount, unit) : lang.past(amount, unit);
}
