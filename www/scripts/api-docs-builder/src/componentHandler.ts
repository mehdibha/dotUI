import ts from "typescript";
import * as tae from "typescript-api-extractor";

import fs from "node:fs";
import path from "node:path";
import type { TType } from "../../../modules/docs/api-reference/types/type-ast";
import memberOrder from "./order.json";
import {
  buildTypeAstFromString,
  type ConversionContext,
  createConversionContext,
  typeToAst,
} from "./type-to-ast";

export interface ParserContext {
  program: ts.Program;
  checker: ts.TypeChecker;
}

interface FormattedProp {
  type: string;
  detailedType?: string;
  /** AST representation of the type for rich rendering */
  typeAst?: TType;
  default?: string;
  required?: boolean;
  description?: string;
}

interface RenderPropInfo {
  selector: string;
  description?: string;
}

const registryDir = path.resolve(process.cwd(), "../packages/registry/src");

function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

// Get component group names from the registry directory
const componentGroupNames = fs.existsSync(path.join(registryDir, "ui"))
  ? fs
      .readdirSync(path.join(registryDir, "ui"), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => kebabToPascal(dirent.name))
      .sort((a, b) => b.length - a.length)
  : [];

export async function formatComponentData(
  exportNode: tae.ExportNode,
  context: ParserContext,
) {
  const description = exportNode.documentation?.description?.replace(
    /\n\nDocumentation: .*$/ms,
    "",
  );

  // Create AST conversion context for type links
  const astContext = createConversionContext(context.checker, 4);

  // Get all properties using TypeScript's type checker (includes inherited props)
  const props = await getPropsWithTypeChecker(
    exportNode.name,
    context,
    astContext,
  );

  // Extract render props (CSS state selectors)
  const renderProps = extractRenderProps(exportNode.name, context);

  // Collect type links for the component
  const typeLinks =
    Object.keys(astContext.links).length > 0 ? astContext.links : undefined;

  const raw = {
    name: exportNode.name,
    description,
    props: sortObjectByKeys(props, memberOrder.props),
    // Add renderProps field (only if not empty)
    ...(Object.keys(renderProps).length > 0 && { renderProps }),
    // Add type links for popover navigation
    ...(typeLinks && { typeLinks }),
  } as Record<string, unknown>;

  // Post-process type strings to align naming
  const componentGroup = extractComponentGroup(exportNode.name);
  const formatted = rewriteTypeStringsDeep(raw, componentGroup) as typeof raw;
  formatted.name = exportNode.name;

  return formatted;
}

/**
 * Use TypeScript's type checker to get ALL properties including inherited ones
 */
async function getPropsWithTypeChecker(
  typeName: string,
  context: ParserContext,
  astContext: ConversionContext,
): Promise<Record<string, FormattedProp>> {
  const { program, checker } = context;
  const result: Record<string, FormattedProp> = {};

  // Find the source file containing this type
  for (const sourceFile of program.getSourceFiles()) {
    if (
      sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes("@dotui")
    ) {
      continue;
    }

    sourceFile.forEachChild((node) => {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === typeName
      ) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const type = checker.getDeclaredTypeOfSymbol(symbol);
        const properties = checker.getPropertiesOfType(type);

        for (const prop of properties) {
          // Skip ref
          if (prop.name === "ref") continue;

          // Get JSDoc documentation
          const docs = ts.displayPartsToString(
            prop.getDocumentationComment(checker),
          );

          // Only include props with documentation (filters out DOM attributes)
          if (!docs) continue;

          // Get the type of the property
          const propType = checker.getTypeOfSymbolAtLocation(prop, node);
          const typeString = checker.typeToString(
            propType,
            undefined,
            ts.TypeFormatFlags.NoTruncation,
          );

          // Get default value from JSDoc @default tag
          const jsDocTags = prop.getJsDocTags(checker);
          const defaultTag = jsDocTags.find((tag) => tag.name === "default");
          const defaultValue = defaultTag
            ? ts.displayPartsToString(defaultTag.text)
            : undefined;

          // Check if optional
          const isOptional = (prop.flags & ts.SymbolFlags.Optional) !== 0;

          // Full type (for detailedType)
          const fullType = formatTypeString(typeString);

          // Short type - remove | undefined for optional props (like base-ui)
          const shortType = isOptional
            ? removeUndefinedFromType(fullType)
            : fullType;

          // Generate AST type for rich rendering
          // First try to build a simplified AST from the type string (preserves aliases)
          // Fall back to full type expansion if no simplification is possible
          const typeAst =
            buildTypeAstFromString(shortType, astContext) ??
            typeToAst(propType, { ...astContext, currentDepth: 0 });

          result[prop.name] = {
            type: shortType,
            detailedType: shortType !== fullType ? fullType : undefined,
            typeAst: typeAst || undefined,
            description: docs,
            default: defaultValue,
            required: !isOptional || undefined,
          };

          // Remove undefined values
          const currentProp = result[prop.name];
          if (currentProp) {
            (Object.keys(currentProp) as Array<keyof FormattedProp>).forEach(
              (key) => {
                if (currentProp[key] === undefined) {
                  delete currentProp[key];
                }
              },
            );
          }
        }
      }
    });
  }

  return result;
}

/**
 * Extract render props from component render props interfaces.
 * Looks for @selector JSDoc tags in properties of render props types
 * (e.g., ButtonRenderProps from ButtonProps).
 */
function extractRenderProps(
  propsTypeName: string,
  context: ParserContext,
): Record<string, RenderPropInfo> {
  const { program, checker } = context;
  const result: Record<string, RenderPropInfo> = {};

  // Derive render props type name from props type name
  // e.g., "ButtonProps" -> "ButtonRenderProps"
  const renderPropsTypeName = propsTypeName.replace(/Props$/, "RenderProps");

  // Search for the render props interface in all source files (including declaration files)
  for (const sourceFile of program.getSourceFiles()) {
    sourceFile.forEachChild((node) => {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === renderPropsTypeName
      ) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const type = checker.getDeclaredTypeOfSymbol(symbol);
        const properties = checker.getPropertiesOfType(type);

        for (const prop of properties) {
          // Get JSDoc tags
          const jsDocTags = prop.getJsDocTags(checker);
          const selectorTag = jsDocTags.find((tag) => tag.name === "selector");

          if (selectorTag) {
            const selectorValue = ts.displayPartsToString(selectorTag.text);
            const description = ts.displayPartsToString(
              prop.getDocumentationComment(checker),
            );

            result[prop.name] = {
              selector: selectorValue.trim(),
              ...(description && { description }),
            };
          }
        }
      }
    });
  }

  return result;
}

/**
 * Format type string to be more readable
 */
function formatTypeString(typeStr: string): string {
  // Clean up React namespace
  let result = typeStr
    .replace(/React\./g, "")
    .replace(/import\([^)]+\)\./g, "");

  // Simplify common React types
  result = result
    .replace(
      /ReactElement<any, string \| JSXElementConstructor<any>>/g,
      "ReactElement",
    )
    .replace(/ReactNode/g, "ReactNode");

  return result;
}

/**
 * Remove | undefined from union types (for short type display)
 */
function removeUndefinedFromType(typeStr: string): string {
  // Handle "Type | undefined" at the end
  let result = typeStr.replace(/\s*\|\s*undefined\s*$/, "");

  // Handle "undefined | Type" at the start
  result = result.replace(/^undefined\s*\|\s*/, "");

  // Handle "Type | undefined | OtherType" in the middle
  result = result.replace(/\s*\|\s*undefined\s*\|/g, " |");

  return result.trim();
}

/**
 * Check if an export is a public Props type
 */
export function isPublicPropsType(exportNode: tae.ExportNode): boolean {
  const name = exportNode.name;

  if (!name.endsWith("Props")) {
    return false;
  }

  if (name.includes("Internal") || name.startsWith("_")) {
    return false;
  }

  if (
    exportNode.documentation?.hasTag("ignore") ||
    exportNode.documentation?.hasTag("internal")
  ) {
    return false;
  }

  const type = exportNode.type;
  return (
    type instanceof tae.ObjectNode ||
    type instanceof tae.IntersectionNode ||
    type instanceof tae.ComponentNode
  );
}

function sortObjectByKeys<T>(
  obj: Record<string, T>,
  order: string[],
): Record<string, T> {
  if (order.length === 0) {
    return obj;
  }

  const sortedObj: Record<string, T> = {};
  const everythingElse: Record<string, T> = {};

  Object.keys(obj).forEach((key) => {
    if (!order.includes(key)) {
      const value = obj[key];
      if (value !== undefined) {
        everythingElse[key] = value;
      }
    }
  });

  const sortedEverythingElseKeys = Object.keys(everythingElse).sort();

  order.forEach((key) => {
    if (key === "__EVERYTHING_ELSE__") {
      sortedEverythingElseKeys.forEach((sortedKey) => {
        const value = everythingElse[sortedKey];
        if (value !== undefined) {
          sortedObj[sortedKey] = value;
        }
      });
    } else if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      if (value !== undefined) {
        sortedObj[key] = value;
      }
    }
  });

  return sortedObj;
}

function extractComponentGroup(componentExportName: string): string {
  const baseName = componentExportName.replace(/Props$/, "");

  const directMatch = componentGroupNames.find((name) =>
    baseName.startsWith(name),
  );

  if (directMatch) {
    return directMatch;
  }

  const match = baseName.match(/^[A-Z][a-z0-9]*/);
  return match ? match[0] : baseName;
}

function rewriteTypeValue(value: string, componentGroup: string): string {
  let next = value;

  next = next.replaceAll(".RootInternal", ".Root");

  if (componentGroup) {
    const escapedGroup = escapeForRegex(componentGroup);
    next = next.replace(
      new RegExp(`\\b${escapedGroup}(Props|State)\\b`, "g"),
      `${componentGroup}.$1`,
    );
  }

  return dedupeUnionMembers(next);
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function dedupeUnionMembers(value: string): string {
  if (!value.includes("|")) {
    return value;
  }

  const unionLinePattern = /^\s*\|/m;
  if (unionLinePattern.test(value)) {
    const seen = new Set<string>();
    const lines = value.split("\n");
    const resultLines: string[] = [];
    let currentEntry: string[] | null = null;

    const flushEntry = () => {
      if (!currentEntry) {
        return;
      }

      const entryText = currentEntry.join("\n");
      const key = entryText.replace(/^\s*\|\s*/, "").trim();
      if (!seen.has(key)) {
        seen.add(key);
        resultLines.push(entryText);
      }

      currentEntry = null;
    };

    lines.forEach((line) => {
      if (line.trim().startsWith("|")) {
        flushEntry();
        currentEntry = [line];
      } else if (currentEntry) {
        currentEntry.push(line);
      } else {
        resultLines.push(line);
      }
    });

    flushEntry();

    return resultLines.join("\n");
  }

  const parts = splitTopLevelUnion(value);
  const seen = new Set<string>();
  const dedupedParts = parts.filter((part) => {
    const key = part.trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return dedupedParts.join(" | ");
}

function splitTopLevelUnion(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  let depthAngle = 0;
  let depthParen = 0;
  let depthCurly = 0;
  let depthSquare = 0;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];

    switch (char) {
      case "<":
        depthAngle += 1;
        break;
      case ">":
        depthAngle = Math.max(0, depthAngle - 1);
        break;
      case "(":
        depthParen += 1;
        break;
      case ")":
        depthParen = Math.max(0, depthParen - 1);
        break;
      case "{":
        depthCurly += 1;
        break;
      case "}":
        depthCurly = Math.max(0, depthCurly - 1);
        break;
      case "[":
        depthSquare += 1;
        break;
      case "]":
        depthSquare = Math.max(0, depthSquare - 1);
        break;
      default:
        break;
    }

    if (
      char === "|" &&
      depthAngle === 0 &&
      depthParen === 0 &&
      depthCurly === 0 &&
      depthSquare === 0
    ) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim() !== "") {
    parts.push(current.trim());
  }

  return parts.length > 0 ? parts : [value];
}

function rewriteTypeStringsDeep(
  node: unknown,
  componentGroup: string,
): unknown {
  if (node == null) {
    return node;
  }

  if (typeof node === "string") {
    return rewriteTypeValue(node, componentGroup);
  }

  if (Array.isArray(node)) {
    return node.map((item) => rewriteTypeStringsDeep(item, componentGroup));
  }

  if (typeof node === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      result[key] = rewriteTypeStringsDeep(value, componentGroup);
    }
    return result;
  }

  return node;
}
