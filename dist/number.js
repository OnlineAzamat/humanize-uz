export function humanizeNumber(n) {
    if (n >= 1000000000)
        return (n / 1000000000).toFixed(1) + " milliard";
    if (n >= 1000000)
        return (n / 1000000).toFixed(1) + " million";
    if (n >= 1000)
        return (n / 1000).toFixed(1) + " ming";
    return n.toString();
}
