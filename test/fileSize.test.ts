import { describe, it, expect } from "vitest";
import { humanizeFileSize } from "../src/fileSize";

describe("humanizeFileSize", () => {
  it("should format 0 as '0 Bayt'", () => {
    expect(humanizeFileSize(0)).toBe("0 Bayt");
  });

  it("should format bytes correctly", () => {
    expect(humanizeFileSize(1024)).toBe("1 KB");
    expect(humanizeFileSize(1024 * 1024)).toBe("1 MB");
  });

  it("should handle decimals", () => {
    expect(humanizeFileSize(1500, 1)).toBe("1.5 KB");
  });

  it("should handle sub-byte, negative and huge values", () => {
    expect(humanizeFileSize(0.5)).toBe("0.5 Bayt");
    expect(humanizeFileSize(-2048)).toBe("-2 KB");
    expect(humanizeFileSize(1024 ** 10)).toBe("1048576 YB");
    expect(humanizeFileSize(-0.001)).toBe("0 Bayt");
  });

  it("should reject non-finite values", () => {
    expect(() => humanizeFileSize(NaN)).toThrow(RangeError);
  });
});
