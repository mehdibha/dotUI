import nextPlugin from "@next/eslint-plugin-next";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // TypeError: context.getAncestors is not a function
      "@next/next/no-duplicate-head": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "no-restricted-properties": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/require-await": "off",
      "react-hooks/react-compiler": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
];