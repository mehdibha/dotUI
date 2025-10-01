import { describe, expect, it } from "vitest";

import { registry } from "@dotui/registry/registry";

import { variantsSchema } from "./schemas";

describe("variantsSchema completeness", () => {
  it("includes all registry components with variants", () => {
    const registryComponents = registry
      .filter((item) => item.variants && Object.keys(item.variants).length > 0)
      .map((item) => item.name)
      .sort();

    const schemaKeys = Object.keys(variantsSchema.shape).sort();
    const missing = registryComponents.filter((n) => !schemaKeys.includes(n));
    const extra = schemaKeys.filter((n) => !registryComponents.includes(n));

    if (missing.length > 0 || extra.length > 0) {
      let errorMsg = "\n";
      if (missing.length > 0) {
        errorMsg += `❌ Missing in variantsSchema:\n${missing.map((n) => `   - ${n}`).join("\n")}\n\n`;
        errorMsg += `Add to schemas.ts:\n${missing.map((n) => `  "${n}": z.enum(${n}Variants),`).join("\n")}\n`;
      }
      if (extra.length > 0) {
        errorMsg += `❌ Extra in variantsSchema (not in registry):\n${extra.map((n) => `   - ${n}`).join("\n")}\n`;
      }
      throw new Error(errorMsg);
    }

    expect(schemaKeys).toEqual(registryComponents);
  });
});
