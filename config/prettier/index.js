import { fileURLToPath } from "node:url";

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  singleQuote: false,
  bracketSpacing: true,
  jsxSingleQuote: false,
  bracketSameLine: false,
  trailingComma: "es5",
  semi: true,
  printWidth: 80,
  arrowParens: "always",
  endOfLine: "auto",
  tailwindFunctions: ["cn", "cva"],
  importOrder: [
    "<TYPES>",
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(next/(.*)$)|^(next$)",
    "^(expo(.*)$)|^(expo$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^@dotui",
    "^@dotui/(.*)$",
    "",
    "<TYPES>^[.|..|~]",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrderTypeScriptVersion: "4.4.0",
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  overrides: [
    {
      files: "*.json.hbs",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.js.hbs",
      options: {
        parser: "babel",
      },
    },
    // Handle .mjs files with ES modules
    {
      files: "*.mjs",
      options: {
        parser: "babel",
        importOrderParserPlugins: ["jsx", "decorators-legacy"],
      },
    },
    // Skip import sorting for MDX files as they have mixed Markdown/JSX syntax
    {
      files: ["*.mdx", "*.md"],
      options: {
        plugins: ["prettier-plugin-tailwindcss"], // Only use tailwind plugin, skip import sorting
      },
    },
    // Skip import sorting for generated files that might have parsing issues
    {
      files: ["**/.source/**/*", "**/generated/**/*"],
      options: {
        plugins: ["prettier-plugin-tailwindcss"], // Only use tailwind plugin, skip import sorting
      },
    },
  ],
};

export default config;
