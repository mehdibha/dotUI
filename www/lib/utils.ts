/**
 * Converts kebab-case to camelCase.
 * e.g., "text-field" -> "textField", "toggle-button" -> "toggleButton"
 */
export function toCamelCase(str: string): string {
  return str
    .split("-")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
}

/**
 * Converts kebab-case to PascalCase.
 * e.g., "alert" -> "Alert", "text-field" -> "TextField"
 */
export function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

