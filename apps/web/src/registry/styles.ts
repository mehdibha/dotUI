import { Registry } from "./schema";

export const styles: Registry = [
  {
    name: "default",
    type: "registry:style",
    label: "Default",
    dependencies: [
      "tailwind-variants",
      "tailwindcss-animate",
      "class-variance-authority",
    ],
    registryDependencies: ["cn", "focus-styles"],
    tailwind: {
      config: {
        plugins: [`require("tailwindcss-animate")`],
      },
    },
    cssVars: {},
    files: [],
  },
];

export type Style = (typeof styles)[number];
