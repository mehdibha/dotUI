interface BackgroundPatternRegistryItem {
  name: string;
  slug: string;
  description: string;
  css: Record<string, Record<string, string>>;
}

export const registryBackgroundPatterns = [
  {
    slug: "grid-fade",
    name: "Grid fade",
    description: "A grid pattern with radial fade mask effect",
    css: {
      ".bg-pattern": {
        "background-image":
          "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
        "background-size": "20px 30px",
        "-webkit-mask-image":
          "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        "mask-image":
          "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
      },
    },
  },
  {
    slug: "diagonal-stripes",
    name: "Diagonal stripes",
    description:
      "A diagonal striped pattern with alternating transparent and gray stripes",
    css: {
      ".bg-pattern": {
        "background-image":
          "repeating-linear-gradient(45deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
      },
    },
  },
] as const satisfies BackgroundPatternRegistryItem[];
