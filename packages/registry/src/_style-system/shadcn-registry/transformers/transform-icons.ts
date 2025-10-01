import { iconLibraries, registryIcons } from "@dotui/registry/icons/registry";

import type { Transformer } from "./index";

export const transformIcons: Transformer = ({ sourceFile, style }) => {
  const targetIconLibrary =
    style.icons.library === "remix" ? "remix" : "lucide";
  const targetLibraryConfig = iconLibraries.find(
    (lib) => lib.name === targetIconLibrary,
  );

  if (!targetLibraryConfig) {
    throw new Error(`Icon library ${targetIconLibrary} not found`);
  }

  const importDeclarations = sourceFile.getImportDeclarations();

  function isKnownIconLibrary(modulePath: string) {
    return iconLibraries.some(
      (lib) => lib.package === modulePath || lib.import === modulePath,
    );
  }

  function findLucideNameFromAny(importedName: string): string {
    // If it's already a lucide name, it will exist as a key
    if (Object.prototype.hasOwnProperty.call(registryIcons, importedName))
      return importedName;
    // Otherwise, reverse-lookup from other libraries (e.g., remix)
    for (const [lucideName, mapping] of Object.entries(registryIcons)) {
      if (Object.values(mapping).includes(importedName)) return lucideName;
    }
    return importedName;
  }

  for (const importDeclaration of importDeclarations) {
    const moduleSpecifierText = importDeclaration.getModuleSpecifierValue();
    const isAliasIcons = moduleSpecifierText === "@/icons";
    const isDirectIconLib = isKnownIconLibrary(moduleSpecifierText);

    if (!isAliasIcons && !isDirectIconLib) continue;

    // Point to the selected icon library package
    importDeclaration.setModuleSpecifier(targetLibraryConfig.package);

    // Rewrite each named import to the target symbol, but alias back
    for (const namedImport of importDeclaration.getNamedImports()) {
      const aliasNode = namedImport.getAliasNode();
      const originalLocalName = aliasNode
        ? aliasNode.getText()
        : namedImport.getName();
      const lucideName = findLucideNameFromAny(originalLocalName);
      const mapping = (registryIcons as Record<string, Record<string, string>>)[
        lucideName
      ];
      if (!mapping) continue;

      const targetSymbol = mapping[targetIconLibrary];
      if (!targetSymbol) continue;

      namedImport.setName(targetSymbol);

      // Preserve the local symbol used in the file to avoid changing usages
      if (originalLocalName !== targetSymbol) {
        namedImport.setAlias(originalLocalName);
      }
    }
  }

  return Promise.resolve(sourceFile);
};
