// import { promises as fs } from "fs";
// import path from "path";

// import type { Variants } from "../../types";

// export async function readComponentFile(
//   componentName: keyof Variants,
//   variant: string,
//   uiPackagePath: string = "../ui",
// ): Promise<string> {
//   try {
//     const filePath = path.join(
//       uiPackagePath,
//       "src/registry/components",
//       componentName,
//       `${variant}.tsx`,
//     );

//     const content = await fs.readFile(filePath, "utf-8");
//     return content;
//   } catch (error) {
//     // If the specific variant doesn't exist, try to fall back to basic
//     if (variant !== "basic") {
//       try {
//         const basicFilePath = path.join(
//           uiPackagePath,
//           "src/registry/components",
//           componentName,
//           "basic.tsx",
//         );

//         const content = await fs.readFile(basicFilePath, "utf-8");
//         return content;
//       } catch (basicError) {
//         throw new Error(
//           `Component file not found: ${componentName}/${variant}.tsx or ${componentName}/basic.tsx`,
//         );
//       }
//     }

//     throw new Error(
//       `Component file not found: ${componentName}/${variant}.tsx`,
//     );
//   }
// }

// export async function checkComponentExists(
//   componentName: keyof Variants,
//   variant: string,
//   uiPackagePath: string = "../ui",
// ): Promise<boolean> {
//   try {
//     const filePath = path.join(
//       uiPackagePath,
//       "src/registry/components",
//       componentName,
//       `${variant}.tsx`,
//     );

//     await fs.access(filePath);
//     return true;
//   } catch {
//     return false;
//   }
// }

// export async function getAvailableVariants(
//   componentName: keyof Variants,
//   uiPackagePath: string = "../ui",
// ): Promise<string[]> {
//   try {
//     const componentDir = path.join(
//       uiPackagePath,
//       "src/registry/components",
//       componentName,
//     );

//     const files = await fs.readdir(componentDir);

//     return files
//       .filter((file) => file.endsWith(".tsx"))
//       .map((file) => file.replace(".tsx", ""));
//   } catch {
//     return [];
//   }
// }
