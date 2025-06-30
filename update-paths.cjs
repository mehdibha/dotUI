const fs = require("fs");
const path = require("path");

function updateFilePaths() {
  const registryPath = path.join(
    __dirname,
    "packages/ui/src/registry/registry-ui.ts",
  );
  const content = fs.readFileSync(registryPath, "utf8");

  // Use eval to parse the TypeScript object
  const codeToEval = content
    .replace(/import.*from.*;\s*/, "") // Remove import
    .replace(/export const ui: Registry\["items"\] = /, "const ui = ") // Simplify declaration
    .replace(/;?\s*$/, "; ui;"); // Add return statement

  let registryData;
  try {
    registryData = eval(codeToEval);
  } catch (error) {
    console.error("Error parsing registry:", error);
    return;
  }

  // Update file paths
  for (const item of registryData) {
    if (item.files && Array.isArray(item.files)) {
      for (const file of item.files) {
        if (file.path && file.path.startsWith("ui/")) {
          // Convert ui/component.style.tsx to components/component/style.tsx
          const oldPath = file.path;

          // Extract the part after 'ui/'
          const pathWithoutPrefix = oldPath.replace("ui/", "");

          // Split by the last dot to separate name and extension
          const lastDotIndex = pathWithoutPrefix.lastIndexOf(".");
          const nameWithStyle = pathWithoutPrefix.substring(0, lastDotIndex);
          const extension = pathWithoutPrefix.substring(lastDotIndex);

          // Split component.style into component and style
          const parts = nameWithStyle.split(".");
          if (parts.length >= 2) {
            const component = parts[0];
            const style = parts.slice(1).join(".");

            // Create new path: components/component/style.tsx
            file.path = `components/${component}/${style}${extension}`;
          }

          console.log(`Updated: ${oldPath} → ${file.path}`);
        }
      }
    }
  }

  // Generate new content
  let newContent = `import type { Registry } from "shadcn/registry";\n\nexport const ui: Registry["items"] = [\n`;

  registryData.forEach((item, index) => {
    newContent += "  {\n";
    newContent += `    name: "${item.name}",\n`;
    newContent += `    type: "${item.type}",\n`;

    if (item.description) {
      newContent += `    description: "${item.description}",\n`;
    }

    if (item.dependencies) {
      newContent += `    dependencies: ${JSON.stringify(item.dependencies)},\n`;
    }

    if (item.registryDependencies) {
      newContent += `    registryDependencies: ${JSON.stringify(item.registryDependencies)},\n`;
    }

    if (item.files) {
      newContent += "    files: [\n";
      item.files.forEach((file, fileIndex) => {
        newContent += "      {\n";
        newContent += `        type: "${file.type}",\n`;
        newContent += `        path: "${file.path}",\n`;
        newContent += `        target: "${file.target}",\n`;
        newContent += "      }";
        if (fileIndex < item.files.length - 1) newContent += ",";
        newContent += "\n";
      });
      newContent += "    ],\n";
    }

    newContent += "  }";
    if (index < registryData.length - 1) newContent += ",";
    newContent += "\n";
  });

  newContent += "];\n";

  fs.writeFileSync(registryPath, newContent);
  console.log("\nFile paths updated successfully!");
}

updateFilePaths();
