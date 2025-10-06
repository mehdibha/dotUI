/**
 * Transform folders in registry-v2/src/ui to single files
 *
 * This script converts each component folder that contains a basic.tsx file
 * into a single .tsx file with the folder name.
 *
 * Example:
 *   alert/basic.tsx → alert.tsx
 *   button/basic.tsx → button.tsx
 *
 * Usage:
 *   pnpm transform
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UI_DIR = path.join(__dirname, "../src/ui");

async function transformFoldersToFiles() {
  // Read all items in the ui directory
  const items = fs.readdirSync(UI_DIR, { withFileTypes: true });

  // Filter only directories
  const directories = items.filter((item) => item.isDirectory());

  let transformed = 0;
  let skipped = 0;

  for (const dir of directories) {
    const folderName = dir.name;
    const folderPath = path.join(UI_DIR, folderName);
    const basicFilePath = path.join(folderPath, "basic.tsx");
    const targetFilePath = path.join(UI_DIR, `${folderName}.tsx`);

    // Check if basic.tsx exists
    if (fs.existsSync(basicFilePath)) {
      // Read content from basic.tsx
      const content = fs.readFileSync(basicFilePath, "utf-8");

      // Write to new file
      fs.writeFileSync(targetFilePath, content, "utf-8");

      console.log(`✓ Transformed: ${folderName}/basic.tsx → ${folderName}.tsx`);
      transformed++;
    } else {
      console.log(`✗ Skipped: ${folderName} (no basic.tsx found)`);
      skipped++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Transformation complete!`);
  console.log(`Total directories: ${directories.length}`);
  console.log(`Transformed: ${transformed}`);
  console.log(`Skipped: ${skipped}`);
  console.log("=".repeat(50));
}

transformFoldersToFiles().catch((error) => {
  console.error("Error transforming folders:", error);
  process.exit(1);
});
