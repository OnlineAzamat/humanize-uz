export function humanizeCurrency(amount, currency = "UZS") {
    // Raqamlarni 3 xonadan ajratish
    const formattedNumber = amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (currency === "UZS") {
        // soʻm (U+02BB) belgisi bilan
        return `${formattedNumber} so\u02BBm`;
    }
    if (currency === "USD") {
        return `$${formattedNumber}`;
    }
    return formattedNumber;
}
