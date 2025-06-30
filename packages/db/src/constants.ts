import type { z } from "zod/v4";

import type { createStyleSchema } from "./schema";

export const DEFAULT_STYLES: Omit<
  z.infer<typeof createStyleSchema>,
  "userId"
>[] = [
  {
    name: "Minimalist",
    slug: "minimalist",
    description: "A minimalist style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    variants: {
      button: "basic",
    },
  },
  {
    name: "Modern",
    slug: "modern",
    description: "A modern style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    name: "Classic",
    slug: "classic",
    description: "A classic style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    name: "Material",
    slug: "material",
    description: "A material style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    name: "Ghibli",
    slug: "ghibli",
    description: "A Ghibli style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    name: "Brutalist",
    slug: "brutalist",
    description: "A brutalist style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    name: "Darky",
    slug: "darky",
    description: "A darky style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    name: "Claude",
    slug: "claude",
    description: "A style inspired by Claude from Anthropic.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    name: "Vercel",
    slug: "vercel",
    description: "A style inspired by Vercel Geist dsign system.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
];
