import { describe, expect, it } from "vitest";
import { pluralizeUz } from "../src/pluralize";

describe("pluralizeUz", () => {
  it("should format 1 as '1 daftar'", () => {
    expect(pluralizeUz(1, 'daftar', 'daftarlar')).toBe("daftar");
  });

  it("should format 8 as '8 avtomabillar'", () => {
    expect(pluralizeUz(8, 'avtomabil', 'avtomabillar')).toBe('avtomabillar');
  });
});