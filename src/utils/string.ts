export const toKebabCase = (string: string): string =>
  string
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .trim();
