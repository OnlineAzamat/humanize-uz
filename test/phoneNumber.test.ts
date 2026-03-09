import { describe, it, expect } from "vitest";
import { humanizePhoneNumber } from "../src/phoneNumber";

describe("humanizePhoneNumber", () => {
  it("should format 9 digit number", () => {
    expect(humanizePhoneNumber("901234567")).toBe("+998 (90) 123-45-67");
  });

  it("should format 12 digit number", () => {
    expect(humanizePhoneNumber("998901234567")).toBe("+998 (90) 123-45-67");
  });

  it("should handle numeric input", () => {
    expect(humanizePhoneNumber(998901234567)).toBe("+998 (90) 123-45-67");
  });

  it("should return original if format is wrong", () => {
    expect(humanizePhoneNumber("123")).toBe("123");
  });
});
