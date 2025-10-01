import type { SourceFile } from "ts-morph";

import type { Transformer } from "./index";

export const transformImport: Transformer = ({ sourceFile }) => {
  const importDeclarations = sourceFile.getImportDeclarations();

  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = importDeclaration.getModuleSpecifier();
    const moduleSpecifierText = moduleSpecifier.getText();
    const moduleSpecifierValue = moduleSpecifierText.slice(1, -1);

    if (moduleSpecifierValue.startsWith("@dotui/registry/")) {
      const newImportPath = moduleSpecifierValue.replace(
        "@dotui/registry/",
        "@/",
      );

      importDeclaration.setModuleSpecifier(newImportPath);

      if (!_useSemicolon(sourceFile)) {
        const newText = importDeclaration.getText().replace(";", "");
        importDeclaration.replaceWithText(newText);
      }
    }
  }

  return Promise.resolve(sourceFile);
};

function _useSemicolon(sourceFile: SourceFile) {
  const firstImport = sourceFile.getImportDeclarations()[0];
  return firstImport?.getText().endsWith(";") ?? false;
}
