import { formatIntl, type LocaleOptions } from "./locale.js";

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
