/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@dotui/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "@next/next/no-img-element": "off",
  },
};