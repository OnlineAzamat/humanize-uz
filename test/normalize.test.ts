import { describe, it, expect } from "vitest";
import { normalizeUz } from "../src/normalize";

describe("normalizeUz", () => {
  it("should use ʻ (U+02BB) after o and g", () => {
    expect(normalizeUz("O'zbekiston")).toBe("Oʻzbekiston")
    expect(normalizeUz("g‘isht")).toBe("gʻisht")
    expect(normalizeUz("to`g`ri")).toBe("toʻgʻri")
    expect(normalizeUz("O’ZBEKISTON")).toBe("OʻZBEKISTON")
    expect(normalizeUz("boʼlmoq")).toBe("boʻlmoq")
  });

  it("should use ʼ (U+02BC) for the tutuq belgisi", () => {
    expect(normalizeUz("ma'no")).toBe("maʼno")
    expect(normalizeUz("Qur’on")).toBe("Qurʼon")
    expect(normalizeUz("taʻlim")).toBe("taʼlim")
    expect(normalizeUz("mo''jiza")).toBe("moʻʼjiza")
  });

  it("should leave quotes around words alone", () => {
    expect(normalizeUz("'salom' dedi")).toBe("'salom' dedi")
  });

  it("should fix decomposed and look-alike letters", () => {
    expect(normalizeUz("Özbekiston")).toBe("Özbekiston")
    expect(normalizeUz("Șahar")).toBe("Şahar")
    expect(normalizeUz("ǧisht")).toBe("ğisht")
  });

  it("should be idempotent", () => {
    const text = "Oʻzbekiston maʼnaviyati, moʻʼjiza"
    expect(normalizeUz(text)).toBe(text)
    expect(normalizeUz(normalizeUz("to'g'ri ma'no"))).toBe("toʻgʻri maʼno")
  });
});

it.each(["'", "`", "´", "‘", "’", "ʻ", "ʼ"])("normalizes final o/g with %s", mark => {
  expect(normalizeUz(`bog${mark}`)).toBe("bogʻ");
  expect(normalizeUz(`o${mark}, bog${mark} bor`)).toBe("oʻ, bogʻ bor");
  expect(normalizeUz(normalizeUz(`bog${mark}`))).toBe("bogʻ");
});
