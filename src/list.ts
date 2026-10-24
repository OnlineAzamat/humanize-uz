import { localize, type LocaleOptions } from "./locale.js";
import { wordsFor } from "./words.js";

/**
 * Massiv elementlarini gap ichida sanash
 * @param items Massiv elementlari
 * @param conjunction Bog'lovchi (standart: oʻzbekcha "va", qoraqalpoqcha "hám")
 * @returns Formatlangan satr: "olma, anor va behi"
 */
export function humanizeList(
  items: string[],
  conjunction?: string,
  options: LocaleOptions = {}
): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, items.length - 1);
  
  return `${otherItems.join(", ")} ${localize(conjunction ?? wordsFor(options.locale).and, options.locale)} ${lastItem}`;
}
