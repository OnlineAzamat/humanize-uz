import { formatIntl, type LocaleOptions } from "./locale.js";

/**
 * Vaqt oralig'ini ifodalash; kirill uchun oy nomlari Intl'dan olinadi
 * @example humanizeTimeRange(start, end) // "10-avgust, 2025, 09:00 - 17:30"
 * @example humanizeTimeRange(start, end, { locale: "uz-Cyrl" }) // "10 август, 2025, 09:00 - 17:30"
 */
export function humanizeTimeRange(start: Date, end: Date, options: LocaleOptions = {}): string {
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
