import type { SourceFile } from "ts-morph";

import {
  iconLibraries,
  icons,
} from "@dotui/registry-definition/registry-icons";

import type { Transformer } from "./index";

export const transformIcons: Transformer = ({ sourceFile, style }) => {
  const targetIconLibrary = style.iconLibrary === "remix" ? "remix" : "lucide";
  const targetLibraryConfig = iconLibraries[targetIconLibrary];

  const importDeclarations = sourceFile.getImportDeclarations();

  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = importDeclaration.getModuleSpecifier();
    const moduleSpecifierValue = moduleSpecifier.getText().slice(1, -1);

    const isIconImport = Object.values(iconLibraries).some(
      (lib) =>
        lib.package === moduleSpecifierValue ||
        lib.import === moduleSpecifierValue,
    );

    if (isIconImport) {
      importDeclaration.setModuleSpecifier(targetLibraryConfig.package);

      const namedImports = importDeclaration.getNamedImports();

      for (const namedImport of namedImports) {
        const importName = namedImport.getName();
        const aliasName = namedImport.getAliasNode()?.getText();

        const targetIconName = findTargetIconName(
          importName,
          targetIconLibrary,
        );

        if (targetIconName && targetIconName !== importName) {
          if (aliasName) {
            namedImport.setName(targetIconName);
          } else {
            namedImport.setName(targetIconName);
          }
        }
      }

      if (!_useSemicolon(sourceFile)) {
        const newText = importDeclaration.getText().replace(";", "");
        importDeclaration.replaceWithText(newText);
      }
    }
  }

  sourceFile.forEachDescendant((node) => {
    if (node.getKindName() === "Identifier") {
      const identifierText = node.getText();
      const targetIconName = findTargetIconName(
        identifierText,
        targetIconLibrary,
      );

      if (targetIconName && targetIconName !== identifierText) {
        const parent = node.getParent();
        if (parent && node.getKindName() === "Identifier") {
          node.replaceWithText(targetIconName);
        }
      }
    }
  });

  return Promise.resolve(sourceFile);
};

function findTargetIconName(
  currentIconName: string,
  targetLibrary: "lucide" | "remix",
): string | null {
  for (const [_iconKey, iconMappings] of Object.entries(icons)) {
    const currentLibrary = targetLibrary === "lucide" ? "remix" : "lucide";

    if (iconMappings[currentLibrary] === currentIconName) {
      return iconMappings[targetLibrary];
    }

    if (iconMappings[targetLibrary] === currentIconName) {
      return currentIconName;
    }
  }

  return null;
}

function _useSemicolon(sourceFile: SourceFile) {
  const firstImport = sourceFile.getImportDeclarations()[0];
  return firstImport?.getText().endsWith(";") ?? false;
}
