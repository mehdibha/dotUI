// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build:core" to regenerate

export const lib = [
  {
    "name": "utils",
    "type": "registry:lib",
    "files": [
      {
        "type": "registry:lib",
        "path": "lib/utils/index.ts",
        "target": "lib/utils.ts",
        "content": `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
      }
    ]
  },
  {
    "name": "focus-styles",
    "type": "registry:lib",
    "defaultVariant": "basic",
    "variants": {
      "basic": {
        "files": [
          {
            "type": "registry:lib",
            "path": "lib/focus-styles/basic.ts",
            "target": "lib/focus-styles.ts",
            "content": `import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "outline-hidden ring-0 ring-border-focus focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
});

export const focusInput = tv({
  base: "ring-0 focus-within:ring-2 focus-within:ring-border-focus",
});

export const focusRingGroup = tv({
  base: "outline-hidden ring-0 ring-border-focus group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg",
});
`
          }
        ]
      }
    }
  }
] as const;
