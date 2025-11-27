import { Project, SyntaxKind } from "ts-morph";
import ts from "typescript";
import * as tae from "typescript-api-extractor";

import fs from "node:fs";
import path from "node:path";
import type {
  TLink,
  TType,
} from "../../../modules/docs/api-reference/types/type-ast";
import {
  buildTypeAstFromString,
  type ConversionContext,
  createConversionContext,
  typeToAst,
} from "./type-to-ast";

// ts-morph project for getting declaration order
let morphProject: Project | null = null;

function getMorphProject(tsconfigPath?: string): Project {
  if (!morphProject) {
    morphProject = new Project({
      tsConfigFilePath: tsconfigPath,
      skipAddingFilesFromTsConfig: false,
    });
  }
  return morphProject;
}

/**
 * Get the order of properties as they appear in the source declaration
 * using ts-morph (preserves declaration order like Babel AST)
 */
function getPropertyDeclarationOrder(
  typeName: string,
  tsconfigPath?: string,
): string[] {
  const project = getMorphProject(tsconfigPath);
  const order: string[] = [];
  const visited = new Set<string>();
  visited.add(typeName);

  // Search all source files for the explicitly EXPORTED type (has export keyword)
  for (const sourceFile of project.getSourceFiles()) {
    // Look for explicitly exported interface declarations
    const interfaceDecl = sourceFile.getInterface(typeName);
    if (interfaceDecl?.hasExportKeyword()) {
      // Get properties in declaration order
      for (const prop of interfaceDecl.getProperties()) {
        order.push(prop.getName());
      }
      // Also get methods
      for (const method of interfaceDecl.getMethods()) {
        order.push(method.getName());
      }
      // Get inherited properties from extends
      for (const ext of interfaceDecl.getExtends()) {
        const extType = ext.getType();
        const extSymbol = extType.getSymbol();
        if (extSymbol) {
          const extName = extSymbol.getName();
          // Recursively get inherited props (these don't need to be exported)
          const inheritedOrder = getPropertyDeclarationOrderInternal(
            extName,
            project,
            visited,
          );
          for (const prop of inheritedOrder) {
            if (!order.includes(prop)) {
              order.push(prop);
            }
          }
        }
      }
      return order;
    }

    // Look for explicitly exported type alias declarations
    const typeAlias = sourceFile.getTypeAlias(typeName);
    if (typeAlias?.hasExportKeyword()) {
      const typeNode = typeAlias.getTypeNode();
      if (typeNode) {
        // Handle type literals
        if (typeNode.getKind() === SyntaxKind.TypeLiteral) {
          const typeLiteral = typeNode.asKindOrThrow(SyntaxKind.TypeLiteral);
          for (const member of typeLiteral.getMembers()) {
            if (member.getKind() === SyntaxKind.PropertySignature) {
              const propSig = member.asKindOrThrow(
                SyntaxKind.PropertySignature,
              );
              order.push(propSig.getName());
            }
          }
          return order;
        }
        // Handle intersection types
        if (typeNode.getKind() === SyntaxKind.IntersectionType) {
          const intersectionType = typeNode.asKindOrThrow(
            SyntaxKind.IntersectionType,
          );
          for (const typeRef of intersectionType.getTypeNodes()) {
            const refType = typeRef.getType();
            const refSymbol = refType.getSymbol();
            if (refSymbol) {
              const refName = refSymbol.getName();
              const refOrder = getPropertyDeclarationOrderInternal(
                refName,
                project,
                visited,
              );
              for (const prop of refOrder) {
                if (!order.includes(prop)) {
                  order.push(prop);
                }
              }
            }
          }
          return order;
        }
      }
    }
  }

  return order;
}

/**
 * Internal helper to get property order - doesn't require export
 * Uses a visited set to prevent infinite recursion from circular type references
 */
function getPropertyDeclarationOrderInternal(
  typeName: string,
  project: Project,
  visited: Set<string> = new Set(),
): string[] {
  // Prevent circular references
  if (visited.has(typeName)) {
    return [];
  }
  visited.add(typeName);

  const order: string[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    const interfaceDecl = sourceFile.getInterface(typeName);
    if (interfaceDecl) {
      for (const prop of interfaceDecl.getProperties()) {
        order.push(prop.getName());
      }
      for (const method of interfaceDecl.getMethods()) {
        order.push(method.getName());
      }
      for (const ext of interfaceDecl.getExtends()) {
        const extType = ext.getType();
        const extSymbol = extType.getSymbol();
        if (extSymbol) {
          const extName = extSymbol.getName();
          const inheritedOrder = getPropertyDeclarationOrderInternal(
            extName,
            project,
            visited,
          );
          for (const prop of inheritedOrder) {
            if (!order.includes(prop)) {
              order.push(prop);
            }
          }
        }
      }
      return order;
    }

    const typeAlias = sourceFile.getTypeAlias(typeName);
    if (typeAlias) {
      const typeNode = typeAlias.getTypeNode();
      if (typeNode) {
        if (typeNode.getKind() === SyntaxKind.TypeLiteral) {
          const typeLiteral = typeNode.asKindOrThrow(SyntaxKind.TypeLiteral);
          for (const member of typeLiteral.getMembers()) {
            if (member.getKind() === SyntaxKind.PropertySignature) {
              const propSig = member.asKindOrThrow(
                SyntaxKind.PropertySignature,
              );
              order.push(propSig.getName());
            }
          }
          return order;
        }
        if (typeNode.getKind() === SyntaxKind.IntersectionType) {
          const intersectionType = typeNode.asKindOrThrow(
            SyntaxKind.IntersectionType,
          );
          for (const typeRef of intersectionType.getTypeNodes()) {
            const refType = typeRef.getType();
            const refSymbol = refType.getSymbol();
            if (refSymbol) {
              const refName = refSymbol.getName();
              const refOrder = getPropertyDeclarationOrderInternal(
                refName,
                project,
                visited,
              );
              for (const prop of refOrder) {
                if (!order.includes(prop)) {
                  order.push(prop);
                }
              }
            }
          }
          return order;
        }
      }
    }
  }

  return order;
}

/**
 * Standard order for React Aria event props.
 * This ensures consistent ordering regardless of TypeScript's internal caching.
 * Order matches the declaration order in React Aria's type definitions.
 */
const REACT_ARIA_EVENT_ORDER = [
  // Press events (from PressEvents)
  "onPress",
  "onPressStart",
  "onPressEnd",
  "onPressChange",
  "onPressUp",
  "onClick",
  // Focus events (from FocusableProps -> FocusEvents)
  "onFocus",
  "onBlur",
  "onFocusChange",
  // Keyboard events (from KeyboardEvents)
  "onKeyDown",
  "onKeyUp",
  // Hover events (from HoverEvents)
  "onHoverStart",
  "onHoverEnd",
  "onHoverChange",
];

/**
 * Sort an object's keys based on a reference order array.
 * Props in the order array come first (in that order),
 * then remaining props follow in their original order (from TypeScript's type checker).
 * Event props are sorted according to REACT_ARIA_EVENT_ORDER for consistency.
 */
function sortByDeclarationOrder<T>(
  obj: Record<string, T>,
  order: string[],
  originalOrder: string[],
): Record<string, T> {
  const sorted: Record<string, T> = {};
  const seen = new Set<string>();

  // First add props that are in the declaration order array (local props)
  for (const key of order) {
    if (key in obj) {
      sorted[key] = obj[key] as T;
      seen.add(key);
    }
  }

  // Add React Aria events in their standard order
  for (const key of REACT_ARIA_EVENT_ORDER) {
    if (!seen.has(key) && key in obj) {
      sorted[key] = obj[key] as T;
      seen.add(key);
    }
  }

  // Then add remaining props in their original order from TypeScript's type checker
  for (const key of originalOrder) {
    if (!seen.has(key) && key in obj) {
      sorted[key] = obj[key] as T;
      seen.add(key);
    }
  }

  return sorted;
}

export interface ParserContext {
  program: ts.Program;
  checker: ts.TypeChecker;
}

/**
 * Recursively collect all TLink nodes from an AST
 */
function collectLinksFromAst(ast: TType | null | undefined): TLink[] {
  if (!ast) return [];

  const links: TLink[] = [];

  function traverse(node: TType): void {
    if (node.type === "link") {
      links.push(node as TLink);
      return;
    }

    // Traverse nested types based on type kind
    switch (node.type) {
      case "union":
        (node as { elements: TType[] }).elements.forEach(traverse);
        break;
      case "intersection":
        (node as { types: TType[] }).types.forEach(traverse);
        break;
      case "function":
        (node as { parameters: TType[]; return: TType }).parameters.forEach(
          traverse,
        );
        traverse((node as { parameters: TType[]; return: TType }).return);
        break;
      case "parameter":
        traverse((node as { value: TType }).value);
        break;
      case "application":
        traverse((node as { base: TType }).base);
        (node as { typeParameters: TType[] }).typeParameters.forEach(traverse);
        break;
      case "array":
        traverse((node as { elementType: TType }).elementType);
        break;
      case "tuple":
        (node as { elements: TType[] }).elements.forEach(traverse);
        break;
      // Add more cases as needed
    }
  }

  traverse(ast);
  return links;
}

/**
 * Types that should be resolved and included in typeLinks
 * These are typically RenderProps types that users want to explore
 */
const RESOLVABLE_TYPE_PATTERNS = [
  /RenderProps$/,
  /Props$/,
  /State$/,
  /Context$/,
  /Event$/, // But not DOM events
];

/**
 * Types that should NEVER be resolved (built-in types)
 */
const SKIP_RESOLVE_TYPES = new Set([
  // DOM types
  "Window",
  "Document",
  "Element",
  "HTMLElement",
  "SVGElement",
  "Node",
  "EventTarget",
  "Navigator",
  // DOM Events (native)
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "FocusEvent",
  "PointerEvent",
  "TouchEvent",
  "DragEvent",
  // React types
  "ReactNode",
  "ReactElement",
  "CSSProperties",
  "RefObject",
  "Ref",
  // Primitives
  "string",
  "number",
  "boolean",
  "null",
  "undefined",
  "void",
  "any",
  "unknown",
  "never",
]);

/**
 * Check if a type name should be resolved
 */
function shouldResolveType(typeName: string): boolean {
  // Skip built-in types
  if (SKIP_RESOLVE_TYPES.has(typeName)) return false;

  // Skip if it looks like a full path (already resolved elsewhere)
  if (typeName.includes("/")) return false;

  // Resolve if it matches our patterns (like ButtonRenderProps)
  return RESOLVABLE_TYPE_PATTERNS.some((pattern) => pattern.test(typeName));
}

/**
 * Resolve a type by name and convert it to AST for the links registry
 * Only resolves types that match RESOLVABLE_TYPE_PATTERNS
 */
function resolveTypeByName(
  typeName: string,
  context: ParserContext,
  _astContext: ConversionContext,
): TType | null {
  // Check if we should resolve this type
  if (!shouldResolveType(typeName)) {
    return null;
  }

  const { program, checker } = context;

  // Search for the type in all source files (including declaration files)
  for (const sourceFile of program.getSourceFiles()) {
    let foundType: TType | null = null;

    sourceFile.forEachChild((node) => {
      if (foundType) return; // Already found

      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === typeName
      ) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const type = checker.getDeclaredTypeOfSymbol(symbol);
        const properties = checker.getPropertiesOfType(type);

        // Build an interface AST with properties (simplified, no recursion)
        const propsAst: Record<
          string,
          {
            type: "property";
            name: string;
            value: TType;
            optional: boolean;
            readonly: boolean;
            description: string;
          }
        > = {};

        for (const prop of properties) {
          const propType = checker.getTypeOfSymbolAtLocation(prop, node);
          // Use a simple type string instead of recursive AST to avoid explosion
          const typeString = checker.typeToString(propType);
          const docs = ts.displayPartsToString(
            prop.getDocumentationComment(checker),
          );
          const isOptional = (prop.flags & ts.SymbolFlags.Optional) !== 0;

          // Create a simple type representation
          const simpleType = parseSimpleTypeString(typeString);

          propsAst[prop.name] = {
            type: "property",
            name: prop.name,
            value: simpleType,
            optional: isOptional,
            readonly: false,
            description: docs || "",
          };
        }

        foundType = {
          type: "interface",
          name: typeName,
          properties: propsAst,
        } as TType;
      }
    });

    if (foundType) return foundType;
  }

  return null;
}

/**
 * Parse a simple type string into a basic AST node
 * This avoids recursive resolution of complex types
 */
function parseSimpleTypeString(typeString: string): TType {
  // Handle primitives
  if (typeString === "string") return { type: "string" } as TType;
  if (typeString === "number") return { type: "number" } as TType;
  if (typeString === "boolean") return { type: "boolean" } as TType;
  if (typeString === "null") return { type: "null" } as TType;
  if (typeString === "undefined") return { type: "undefined" } as TType;
  if (typeString === "void") return { type: "void" } as TType;
  if (typeString === "any") return { type: "any" } as TType;
  if (typeString === "unknown") return { type: "unknown" } as TType;
  if (typeString === "never") return { type: "never" } as TType;

  // For anything else, just return as identifier
  return { type: "identifier", name: typeString } as TType;
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

/**
 * Expand type aliases into their readable form
 * Handles types with or without | undefined suffix
 * e.g., ChildrenOrFunction<T> | undefined → ReactNode | (values: T) => ReactNode | undefined
 */
function expandTypeAliasInString(type: string): string {
  // Check if type ends with | undefined
  const hasUndefined = type.endsWith(" | undefined");
  const baseType = hasUndefined ? type.slice(0, -" | undefined".length) : type;
  const suffix = hasUndefined ? " | undefined" : "";

  // ChildrenOrFunction<T> → ReactNode | (values: T) => ReactNode
  const childrenMatch = baseType.match(/^ChildrenOrFunction<(.+)>$/);
  if (childrenMatch) {
    return `ReactNode | (values: ${childrenMatch[1]}) => ReactNode${suffix}`;
  }

  // ClassNameOrFunction<T> → string | (values: T) => string
  const classNameMatch = baseType.match(/^ClassNameOrFunction<(.+)>$/);
  if (classNameMatch) {
    return `string | (values: ${classNameMatch[1]}) => string${suffix}`;
  }

  // StyleOrFunction<T> → CSSProperties | (values: T) => CSSProperties
  const styleMatch = baseType.match(/^StyleOrFunction<(.+)>$/);
  if (styleMatch) {
    return `CSSProperties | (values: ${styleMatch[1]}) => CSSProperties${suffix}`;
  }

  return type;
}

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
  tsconfigPath?: string,
) {
  const description = exportNode.documentation?.description?.replace(
    /\n\nDocumentation: .*$/ms,
    "",
  );

  // Create AST conversion context for type links
  const astContext = createConversionContext(context.checker, 4);

  // Get all properties using TypeScript's type checker (includes inherited props)
  // Pass tsconfigPath to get declaration order via ts-morph
  const props = await getPropsWithTypeChecker(
    exportNode.name,
    context,
    astContext,
    tsconfigPath,
  );

  // Extract render props (CSS state selectors)
  const renderProps = extractRenderProps(exportNode.name, context);

  // Collect type links for the component
  const typeLinks =
    Object.keys(astContext.links).length > 0 ? astContext.links : undefined;

  const raw = {
    name: exportNode.name,
    description,
    props, // Keep natural TypeScript declaration order (like react-aria)
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
  tsconfigPath?: string,
): Promise<Record<string, FormattedProp>> {
  const { program, checker } = context;
  const result: Record<string, FormattedProp> = {};

  // Get declaration order from ts-morph (for local props)
  const declarationOrder = getPropertyDeclarationOrder(typeName, tsconfigPath);

  // Track original order from TypeScript's type checker (preserves inherited order)
  const originalOrder: string[] = [];

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
        // Only process exported interfaces to avoid duplicates with different orders
        const isExported = !!(
          ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export
        );
        if (!isExported) return;

        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        const type = checker.getDeclaredTypeOfSymbol(symbol);
        const properties = checker.getPropertiesOfType(type);

        for (const prop of properties) {
          originalOrder.push(prop.name);
        }

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

          // Full type (for detailedType) - also expand aliases
          const rawType = formatTypeString(typeString);
          const fullType = expandTypeAliasInString(rawType);

          // Remove | undefined first for optional props
          const shortType = isOptional
            ? removeUndefinedFromType(fullType)
            : fullType;

          // Generate AST type for rich rendering
          // First try to build a simplified AST from the type string (preserves aliases)
          // Fall back to full type expansion if no simplification is possible
          const typeAst =
            buildTypeAstFromString(shortType, astContext) ??
            typeToAst(propType, { ...astContext, currentDepth: 0 });

          // Scan the AST for link nodes and resolve referenced types
          if (typeAst) {
            const linkedTypes = collectLinksFromAst(typeAst);
            for (const link of linkedTypes) {
              // Skip if already resolved
              if (astContext.links[link.id]) continue;

              // Try to resolve the type by name
              const resolvedType = resolveTypeByName(
                link.name,
                context,
                astContext,
              );
              if (resolvedType) {
                astContext.links[link.id] = resolvedType;
              }
            }
          }

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

  // Sort props by declaration order (matches react-aria/s2-docs behavior)
  // Local props come first (in ts-morph declaration order), then React Aria events
  // in their standard order, then remaining props
  return sortByDeclarationOrder(result, declarationOrder, originalOrder);
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
