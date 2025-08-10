export function humanizeTimeRange(start, end) {
    const opts = { hour: '2-digit', minute: '2-digit' };
    const dateOpts = { day: 'numeric', month: 'long', year: 'numeric' };
    const startDate = start.toLocaleDateString('uz-UZ', dateOpts);
    const endDate = end.toLocaleDateString('uz-UZ', dateOpts);
    if (startDate === endDate) {
        return `${startDate}, ${start.toLocaleTimeString('uz-UZ', opts)} - ${end.toLocaleTimeString('uz-UZ', opts)}`;
    }
    return `${startDate}, ${start.toLocaleTimeString('uz-UZ', opts)} - ${endDate} ${end.toLocaleTimeString('uz-UZ', opts)}`;
}
