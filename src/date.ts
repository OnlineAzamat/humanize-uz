export function humanizeDate(input: string | Date): string {
  const date = new Date(input);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);

  if (diff === 0) return "bugun";
  if (diff === 1) return "kecha";
  if (diff < 7) return `${diff} kun oldin`;
  return date.toLocaleDateString("uz-UZ");
}

export function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const seconds =  Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 10);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} soniya oldin`
  if (minutes < 60) return `${minutes} daqiqa oldin`
  if (hours < 24) return `${hours} soat oldin`
  if (days < 7) return `${days} kun oldin`
  return date.toLocaleDateString("uz-UZ");
}