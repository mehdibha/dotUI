import { describe, expect, it } from "vitest";

import { createStyle } from "../../src/core";
import { generateRegistryBase } from "../../src/shadcn-registry/generators/base";
import { restoreStyleDefinitionDefaults } from "../../src/utils";
import { mockStyleDefinition } from "../fixtures/styles";

describe("generateRegistryBase", () => {
  const baseUrl = "https://ui.example.com";

  const mockStyle = createStyle(mockStyleDefinition);

  it("should generate a registry base with correct structure", () => {
    const result = generateRegistryBase({
      baseUrl,
      style: mockStyle,
    });

    expect(result).toMatchObject({
      name: "base",
      type: "registry:style",
      extends: "none",
      files: [],
    });

    expect(result.dependencies).toBeInstanceOf(Array);
    expect(result.registryDependencies).toBeInstanceOf(Array);
  });

  it("should include original base dependencies", () => {
    const result = generateRegistryBase({
      baseUrl,
      style: mockStyle,
    });

    expect(result.dependencies).toContain("tailwind-variants");
    expect(result.dependencies).toContain("react-aria-components");
    expect(result.dependencies).toContain("tailwindcss-react-aria-components");
    expect(result.dependencies).toContain("tw-animate-css");
  });

  it("should add lucide-react dependency when using lucide icons", () => {
    const styleWithLucide = createStyle(
      restoreStyleDefinitionDefaults({
        name: "Style with Lucide",
        slug: "style-with-lucide",
        description: null,
        theme: {
          colors: {
            modes: {
              light: {},
            },
          },
        },
        icons: {
          library: "lucide",
        },
        variants: {},
      }),
    );

    const result = generateRegistryBase({
      baseUrl,
      style: styleWithLucide,
    });

    expect(result.dependencies).toContain("lucide-react");
  });

  it("should add @remixicon/react dependency when using remix icons", () => {
    const remixStyle = createStyle(
      restoreStyleDefinitionDefaults({
        name: "Style with Remix",
        slug: "style-with-remix",
        theme: {
          colors: {
            modes: {
              light: {},
            },
          },
        },
        icons: {
          library: "remix",
        },
        description: null,
        variants: {},
      }),
    );
    const result = generateRegistryBase({
      baseUrl,
      style: remixStyle,
    });

    expect(result.dependencies).toContain("@remixicon/react");
  });

  it("should update registry dependencies with correct base URL and style slug", () => {
    const result = generateRegistryBase({
      baseUrl,
      style: mockStyle,
    });

    expect(result.registryDependencies).toEqual([
      `${baseUrl}/${mockStyle.slug}/utils`,
      `${baseUrl}/${mockStyle.slug}/focus-styles`,
      `${baseUrl}/${mockStyle.slug}/theme`,
    ]);
  });
});
