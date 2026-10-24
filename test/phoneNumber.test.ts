import { describe, it, expect } from "vitest";
import { humanizePhoneNumber, getPhoneOperator, isValidUzPhone } from "../src/phoneNumber";

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

describe("getPhoneOperator", () => {
  it("should detect the operator from the code", () => {
    expect(getPhoneOperator("+998 90 123 45 67")).toBe("Beeline");
    expect(getPhoneOperator("931234567")).toBe("Ucell");
    expect(getPhoneOperator(998971234567)).toBe("Mobiuz");
    expect(getPhoneOperator("+998 (99) 123-45-67")).toBe("Uzmobile");
    expect(getPhoneOperator("331234567")).toBe("Humans");
  });

  it("should return null for unknown codes and malformed numbers", () => {
    expect(getPhoneOperator("712345678")).toBeNull();
    expect(getPhoneOperator("12345")).toBeNull();
    expect(getPhoneOperator("+7 901 123 45 67")).toBeNull();
  });
});

describe("isValidUzPhone", () => {
  it("should accept known mobile numbers only", () => {
    expect(isValidUzPhone("+998 (90) 123-45-67")).toBe(true);
    expect(isValidUzPhone("901234567")).toBe(true);
    expect(isValidUzPhone("+998 12 345 67 89")).toBe(false);
    expect(isValidUzPhone("90123456")).toBe(false);
  });
});
