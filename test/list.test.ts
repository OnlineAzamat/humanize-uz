import { describe, it, expect } from "vitest";
import { humanizeList } from "../src/list";

describe("humanizeList", () => {
  it("should handle empty array", () => {
    expect(humanizeList([])).toBe("");
  });

  it("should handle single item", () => {
    expect(humanizeList(["olma"])).toBe("olma");
  });

  it("should format list with default conjunction", () => {
    expect(humanizeList(["olma", "anor", "behi"])).toBe("olma, anor va behi");
  });

  it("should format list with custom conjunction", () => {
    expect(humanizeList(["olma", "anor", "behi"], "hamda")).toBe("olma, anor hamda behi");
  });
});
