"use server";

import {
  type Symbol as MorphSymbol,
  Node,
  Project,
  type Type,
  ts,
} from "ts-morph";

import fs from "node:fs";
import path from "node:path";
import type { PropDoc } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __dotuiApiReferenceProject: Project | undefined;
  // eslint-disable-next-line no-var
  var __dotuiApiReferenceCache: Map<string, PropDoc[]> | undefined;
}

const PROP_CACHE =
  globalThis.__dotuiApiReferenceCache ??
  (globalThis.__dotuiApiReferenceCache = new Map<string, PropDoc[]>());

function getProject() {
  if (globalThis.__dotuiApiReferenceProject) {
    return globalThis.__dotuiApiReferenceProject;
  }

  const tsconfigCandidates = [
    path.resolve(process.cwd(), "tsconfig.json"),
    path.resolve(process.cwd(), "../tsconfig.json"),
  ];

  const tsconfigPath =
    tsconfigCandidates.find((candidate) => fs.existsSync(candidate)) ??
    tsconfigCandidates[0];

  globalThis.__dotuiApiReferenceProject = new Project({
    tsConfigFilePath: tsconfigPath,
    skipAddingFilesFromTsConfig: false,
  });

  return globalThis.__dotuiApiReferenceProject;
}

function resolveSourcePath(source: string) {
  if (path.isAbsolute(source)) {
    if (!fs.existsSync(source)) {
      throw new Error(`ApiReference: unable to find ${source}`);
    }
    return source;
  }

  const candidates = [
    path.resolve(process.cwd(), source),
    path.resolve(process.cwd(), "..", source),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`ApiReference: unable to find ${source}`);
}

export function parseComponentProps(source: string, exportName: string) {
  const absolutePath = resolveSourcePath(source);
  const cacheKey = `${absolutePath}#${exportName}`;
  if (PROP_CACHE.has(cacheKey)) {
    return PROP_CACHE.get(cacheKey)!;
  }

  const project = getProject();
  const sourceFile =
    project.getSourceFile(absolutePath) ??
    project.addSourceFileAtPath(absolutePath);

  const declarations = sourceFile.getExportedDeclarations().get(exportName);
  if (!declarations?.length) {
    throw new Error(
      `ApiReference: export "${exportName}" not found in ${source}`,
    );
  }

  const declaration = declarations[0];
  const type = getDeclarationType(declaration);
  const props = extractPropsFromType(type);

  PROP_CACHE.set(cacheKey, props);
  return props;
}

function getDeclarationType(node: Node): Type {
  if (Node.isInterfaceDeclaration(node) || Node.isTypeAliasDeclaration(node)) {
    return node.getType();
  }

  const type = node.getType();
  if (!type) {
    throw new Error(
      `ApiReference: unable to resolve type information for ${node.getSymbol()?.getName()}`,
    );
  }

  return type;
}

function extractPropsFromType(type: Type) {
  const propsMap = new Map<string, PropDoc>();

  for (const symbol of type.getApparentProperties()) {
    if (symbol.getName().startsWith("__@")) {
      continue;
    }

    const doc = symbolToPropDoc(symbol);
    if (!doc) {
      continue;
    }

    if (!propsMap.has(doc.name)) {
      propsMap.set(doc.name, doc);
    }
  }

  return Array.from(propsMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

function symbolToPropDoc(symbol: MorphSymbol): PropDoc | null {
  const declarations = symbol.getDeclarations();
  const declaration = symbol.getValueDeclaration() ?? declarations[0];

  if (!declaration) {
    return null;
  }

  if (
    !Node.isPropertySignature(declaration) &&
    !Node.isPropertyDeclaration(declaration) &&
    !Node.isMethodSignature(declaration) &&
    !Node.isMethodDeclaration(declaration)
  ) {
    return null;
  }

  const docs = collectDocs(declarations);
  const location = declaration;
  const type = symbol.getTypeAtLocation(location);
  const typeText = type.getText(location);
  const optional =
    declarations.some(
      (node) =>
        (Node.isPropertySignature(node) ||
          Node.isPropertyDeclaration(node) ||
          Node.isMethodSignature(node)) &&
        Boolean(node.hasQuestionToken?.()),
    ) || symbol.hasFlags(ts.SymbolFlags.Optional);

  return {
    name: symbol.getName(),
    type: typeText,
    optional,
    description: docs.description,
    defaultValue: docs.defaultValue,
    deprecated: docs.deprecated,
  };
}

function collectDocs(nodes: Node[]) {
  const jsDocs = nodes.flatMap((node) => node.getJsDocs());
  const descriptions = jsDocs
    .map((doc) => doc.getDescription().trim())
    .filter(Boolean);

  const tagInfo = jsDocs
    .flatMap((doc) => doc.getTags())
    .reduce(
      (acc, tag) => {
        const name = getTagName(tag);
        if (!name) {
          return acc;
        }

        const text = getTagComment(tag);
        if (name === "default" && !acc.defaultValue) {
          acc.defaultValue = text;
        }
        if (name === "deprecated" && !acc.deprecated) {
          acc.deprecated = text || "Deprecated";
        }
        return acc;
      },
      {
        defaultValue: undefined as string | undefined,
        deprecated: undefined as string | undefined,
      },
    );

  return {
    description: descriptions.join("\n\n") || undefined,
    defaultValue: tagInfo.defaultValue,
    deprecated: tagInfo.deprecated,
  };
}

function getTagName(tag: Node) {
  const anyTag = tag as unknown as {
    getTagName?: () => string;
    getName?: () => string;
    getTagNameNode?: () => Node | undefined;
  };

  if (typeof anyTag.getTagName === "function") {
    return anyTag.getTagName();
  }
  if (typeof anyTag.getName === "function") {
    const value = anyTag.getName();
    if (typeof value === "string") {
      return value;
    }
  }
  if (typeof anyTag.getTagNameNode === "function") {
    return anyTag.getTagNameNode()?.getText();
  }

  return undefined;
}

function getTagComment(tag: Node) {
  const anyTag = tag as unknown as {
    getComment?: () => string | (string | Node)[];
    getText?: () => string;
  };

  const value =
    typeof anyTag.getComment === "function"
      ? anyTag.getComment()
      : typeof anyTag.getText === "function"
        ? anyTag.getText()
        : undefined;

  if (Array.isArray(value)) {
    return value
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (typeof part?.getText === "function") {
          return part.getText();
        }
        return "";
      })
      .join("")
      .trim();
  }

  return (value ?? "").toString().trim();
}
