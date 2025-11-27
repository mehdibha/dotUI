/**
 * Type declarations for globals-docs package
 * @see https://www.npmjs.com/package/globals-docs
 */
declare module "globals-docs" {
  /**
   * Documentation object with environment-specific globals
   */
  export const docs: {
    builtin: Record<string, string>;
    nonstandard: Record<string, string>;
    browser: Record<string, string>;
    worker: Record<string, string>;
    node: Record<string, string>;
  };

  /**
   * Lowercased version of the docs object
   */
  export const lowerCased: typeof docs;

  /**
   * Get a URL for a global object
   * @param name - Name of the global object
   * @param env - Environments to search (defaults to all)
   * @returns The URL of the documentation resource, if found
   * @example getDoc('Array') // yields MDN documentation for Array
   */
  export function getDoc(
    name: string,
    env?: Array<"builtin" | "nonstandard" | "browser" | "worker" | "node">,
  ): string | undefined;
}
