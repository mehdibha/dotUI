const IMPORT_STATEMENT_REGEX = /^import.*?;\n/gm;
const FUNCTION_WRAPPER_REGEX =
  /^export\s+(default\s+)?function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\(?\s*/m;
const FUNCTION_END_REGEX = /\s*\)?\s*;?\s*\}\s*$/m;
const PROPS_SPREAD_REGEX = /\s*\{\s*\.\.\.props\s*\}/g;

export const extractPreviewSource = (source: string) => {
  return source
    .replace(IMPORT_STATEMENT_REGEX, "")
    .replace(FUNCTION_WRAPPER_REGEX, "")
    .replace(FUNCTION_END_REGEX, "")
    .replace(PROPS_SPREAD_REGEX, "")
    .trim();
};

export const injectAttributesIntoSource = (
  source: string,
  attributes: string[],
) => {
  if (!attributes.length) {
    return source.trim();
  }

  const formatted =
    attributes.length === 1 && attributes[0] && attributes[0].length <= 40
      ? ` ${attributes[0]}`
      : `${attributes.map((attr) => `\n  ${attr}`).join("")}\n`;

  return source.replace(/<([A-Za-z][^>\s]*)/, `<$1${formatted}`).trim();
};

export const stripPropsTypeAnnotations = (source: string) => {
  let updatedSource = source;

  const functionPattern =
    /(export\s+)?function\s+(\w+)\s*\(\s*props(?:\s*:\s*[^)]*)?\s*\)/g;
  updatedSource = updatedSource.replace(
    functionPattern,
    (_match, exp: string | undefined, name: string) => {
      const prefix = exp ? "export " : "";
      return `${prefix}function ${name}()`;
    },
  );

  updatedSource = updatedSource.replace(/props\s*:\s*[^)\r\n]+/g, "props");

  updatedSource = updatedSource.replace(
    /import\s+\{([^}]*)\}\s+from\s+([^;]+);?/g,
    (_match, specifiers: string, from: string) => {
      const filtered = specifiers
        .split(",")
        .map((spec: string) => spec.trim())
        .filter(Boolean)
        .filter((spec: string) => !spec.startsWith("type "));

      if (!filtered.length) {
        return "";
      }

      return `import { ${filtered.join(", ")} } from ${from};`;
    },
  );

  updatedSource = updatedSource.replace(
    /import\s+type\s+\{[^}]*\}\s+from\s+[^;]+;?/g,
    "",
  );

  updatedSource = updatedSource.replace(
    /import\s+\{\s*\}\s+from\s+[^;]+;?\n?/g,
    "",
  );

  updatedSource = updatedSource.replace(PROPS_SPREAD_REGEX, "");

  return updatedSource;
};
