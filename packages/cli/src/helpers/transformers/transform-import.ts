import { ExtendedConfig } from "@dotui/schemas";
import { Transformer } from "@/helpers/transformers";

export const transformImport: Transformer = async ({ sourceFile, config }) => {
  const importDeclarations = sourceFile.getImportDeclarations();
  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = updateImportAliases(
      importDeclaration.getModuleSpecifierValue(),
      config
    );
    importDeclaration.setModuleSpecifier(moduleSpecifier);
  }

  return sourceFile;
};

function updateImportAliases(moduleSpecifier: string, config: ExtendedConfig) {
  // Not a local import.
  if (!moduleSpecifier.startsWith("@/")) {
    return moduleSpecifier;
  }

  // Not a registry import.
  if (!moduleSpecifier.startsWith("@/registry/")) {
    // We fix the alias and return.
    const alias = config.aliases.components.split("/")[0];
    return moduleSpecifier.replace(/^@\//, `${alias}/`);
  }

  if (moduleSpecifier.match(/^@\/registry\/core/)) {
    return moduleSpecifier
      .replace(/^@\/registry\/core/, config.aliases.core)
      .replace(/_[^/_]+$/, "");
  }

  if (
    config.aliases.components &&
    moduleSpecifier.match(/^@\/registry\/components/)
  ) {
    return moduleSpecifier.replace(
      /^@\/registry\/components/,
      config.aliases.components
    );
  }

  if (config.aliases.lib && moduleSpecifier.match(/^@\/registry\/lib/)) {
    return moduleSpecifier.replace(/^@\/registry\/lib/, config.aliases.lib);
  }

  if (config.aliases.hooks && moduleSpecifier.match(/^@\/registry\/hooks/)) {
    return moduleSpecifier.replace(/^@\/registry\/hooks/, config.aliases.hooks);
  }

  return moduleSpecifier.replace(
    /^@\/registry\/[^/]+/,
    config.aliases.components
  );
}
