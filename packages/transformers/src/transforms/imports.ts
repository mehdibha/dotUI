import type { Transform } from "../types";

/**
 * Transform @dotui/registry/* imports to @/* (user's project alias)
 */
export const transformImports: Transform = (content) => {
  return content.replace(/@dotui\/registry\//g, "@/");
};

/**
 * Transform imports with custom target alias
 */
export function createImportTransform(targetAlias: string): Transform {
  return (content) => {
    return content.replace(/@dotui\/registry\//g, targetAlias);
  };
}
