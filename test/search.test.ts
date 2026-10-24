import { describe, it, expect } from "vitest";
import { compareUz, searchKey } from "../src/search";

describe("compareUz", () => {
  it("should sort in Uzbek alphabet order", () => {
    expect(["choy", "shahar", "oʻrik", "olma", "gʻisht", "zamon"].sort(compareUz))
      .toEqual(["olma", "zamon", "oʻrik", "gʻisht", "shahar", "choy"]);
    // "h" va "x" lotin tartibida emas: ... g h i ... v x y z
    expect(["xalq", "yer", "hayot"].sort(compareUz)).toEqual(["hayot", "xalq", "yer"]);
  });

  it("should treat every spelling of a letter the same", () => {
    expect(compareUz("Oʻzbek", "O'zbek")).toBe(0);
    expect(compareUz("Özbek", "Ўзбек")).toBe(0);
    expect(compareUz("Shahar", "şahar")).toBe(0);
    expect(compareUz("maʼno", "mano")).toBe(0);
  });

  it("should put shorter prefixes and digits first", () => {
    expect(compareUz("ol", "olma")).toBeLessThan(0);
    expect(compareUz("1-uy", "uy")).toBeLessThan(0);
  });
});

describe("searchKey", () => {
  it("should map every spelling and script to one key", () => {
    const key = searchKey("Oʻzbekiston");
    expect(searchKey("O'zbekiston")).toBe(key);
    expect(searchKey("OʻZBEKISTON")).toBe(key);
    expect(searchKey("Özbekiston")).toBe(key);
    expect(searchKey("Ўзбекистон")).toBe(key);
    expect(key).toBe("özbekiston");
  });

  it("should match plain-typed queries in loose mode", () => {
    const key = searchKey("Oʻzbekiston", { loose: true });
    expect(searchKey("ozbekiston", { loose: true })).toBe(key);
    expect(searchKey("Шаҳар", { loose: true })).toBe(searchKey("shahar", { loose: true }));
    expect(searchKey("maʼno", { loose: true })).toBe("mano");
  });
});
