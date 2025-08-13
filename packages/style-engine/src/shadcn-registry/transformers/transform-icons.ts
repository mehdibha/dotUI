// import type { SourceFile } from "ts-morph";

import {
  iconLibraries,
  icons,
} from "@dotui/registry-definition/registry-icons";

import type { IconLibrary } from "../../types";
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

  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = importDeclaration.getModuleSpecifier();
    const moduleSpecifierValue = moduleSpecifier.getText().slice(1, -1);

    const isIconImport = Object.values(iconLibraries).some(
      (lib) => lib.package === moduleSpecifierValue,
    );

    if (isIconImport) {
      moduleSpecifier.replaceWithText(`"${targetLibraryConfig.package}"`);

      const namedImports = importDeclaration.getNamedImports();
      for (const namedImport of namedImports) {
        const importName = namedImport.getName();
        const targetIconName = icons[importName as IconLibrary];
        if (targetIconName) {
          const targetIcon = targetIconName[targetIconLibrary];
          if (targetIcon) {
            namedImport.setName(targetIcon);
          }
        }
      }
    }
  }

  return new Promise((resolve) => {
    resolve(sourceFile);
  });
};
