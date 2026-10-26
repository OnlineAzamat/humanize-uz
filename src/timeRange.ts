import { formatIntl, isKaa, localize, type LocaleOptions } from "./locale.js";
import { kaa } from "./words.js";

const pad2 = (n: number) => String(n).padStart(2, "0");

// Intl'da qoraqalpoq tili yoʻq: oy nomlari kutubxonaning oʻzidan olinadi
function kaaDate(date: Date): string {
  return `${date.getDate()}-${kaa.months[date.getMonth()]}, ${date.getFullYear()}`;
}

function kaaTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/**
 * Vaqt oralig'ini ifodalash; oʻzbekcha kirill uchun oy nomlari Intl'dan olinadi
 * @example humanizeTimeRange(start, end) // "10-avgust, 2025, 09:00 - 17:30"
 * @example humanizeTimeRange(start, end, { locale: "uz-Cyrl" }) // "10 август, 2025, 09:00 - 17:30"
 */
export function humanizeTimeRange(start: Date, end: Date, options: LocaleOptions = {}): string {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new RangeError("Notoʻgʻri vaqt oraligʻi: sana yaroqsiz");
  }
  if (isKaa(options.locale)) {
    const range = kaaDate(start) === kaaDate(end)
      ? `${kaaDate(start)}, ${kaaTime(start)} - ${kaaTime(end)}`
      : `${kaaDate(start)}, ${kaaTime(start)} - ${kaaDate(end)}, ${kaaTime(end)}`;
    return localize(range, options.locale);
  }

  const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const dateOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  return formatIntl(options.locale, (locale) => {
    const startDate = start.toLocaleDateString(locale, dateOpts);
    const endDate = end.toLocaleDateString(locale, dateOpts);

    if (startDate === endDate) {
      return `${startDate}, ${start.toLocaleTimeString(locale, opts)} - ${end.toLocaleTimeString(locale, opts)}`;
    }

    return `${startDate}, ${start.toLocaleTimeString(locale, opts)} - ${endDate}, ${end.toLocaleTimeString(locale, opts)}`;
  });
}
