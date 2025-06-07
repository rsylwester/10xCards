import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      const showConditional = true;
      const showHidden = false;
      expect(cn("base", showConditional && "conditional", showHidden && "hidden")).toBe("base conditional");
    });

    it("should handle arrays of classes", () => {
      expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
    });

    it("should handle Tailwind class conflicts", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
      expect(cn("p-4", "px-2")).toBe("p-4 px-2");
    });

    it("should filter out falsy values", () => {
      expect(cn("base", null, undefined, "", "valid")).toBe("base valid");
    });
  });
});
