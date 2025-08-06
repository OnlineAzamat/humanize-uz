export function humanizeNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + " milliard"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + " million"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + " ming"
  return n.toString()
}