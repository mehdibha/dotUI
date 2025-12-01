/**
 * API Docs Builder
 *
 * Generates JSON reference files for component props by parsing TypeScript
 * using typescript-api-extractor and TypeScript's type checker for inherited props.
 *
 * Usage:
 *   pnpm build:references
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { kebabCase } from "es-toolkit/string";
import { globby } from "globby";
import ts from "typescript";
import * as tae from "typescript-api-extractor";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import {
  formatComponentData,
  isPublicPropsType,
  type ParserContext,
} from "./componentHandler";

const CONFIG_PATH = path.join(
  process.cwd(),
  "../packages/registry/tsconfig.build.json",
);
const OUTPUT_DIR = path.join(
  process.cwd(),
  "modules/docs/api-reference/generated",
);

interface RunOptions {
  files?: string[];
}

async function run(options: RunOptions) {
  console.log("🔧 API Docs Builder\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Resolve absolute path to tsconfig
  const configDir = path.dirname(CONFIG_PATH);

  console.log(`Using tsconfig: ${CONFIG_PATH}`);
  console.log(`Config directory: ${configDir}\n`);

  // Load config and create TypeScript program
  const config = tae.loadConfig(CONFIG_PATH);
  const program = ts.createProgram(config.fileNames, config.options);
  const checker = program.getTypeChecker();

  // Create parser context for passing to formatComponentData
  const parserContext: ParserContext = {
    program,
    checker,
  };

  // Get files to process
  const targetFiles = await getFilesToProcess(options, configDir);

  console.log(`Found ${targetFiles.length} files to process\n`);

  // Collect all exports from target files
  const allExports: tae.ExportNode[] = [];
  let errorCount = 0;

  for (const file of targetFiles) {
    console.log(`Processing ${path.relative(configDir, file)}`);

    try {
      const ast = tae.parseFromProgram(file, program);
      if (ast.exports.length > 0) {
        console.log(
          `  Found ${ast.exports.length} exports: ${ast.exports.map((e) => e.name).join(", ")}`,
        );
      }
      allExports.push(...ast.exports);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`  ⛔ Error: ${errorMessage}`);
      errorCount += 1;
    }
  }

  // Filter for public Props types
  const propsExports = allExports.filter(isPublicPropsType);

  console.log(`\nFound ${propsExports.length} Props interfaces\n`);

  let componentCount = 0;

  // Generate JSON files
  for (const exportNode of propsExports) {
    try {
      const componentRef = await formatComponentData(exportNode, parserContext);
      const json = `${JSON.stringify(componentRef, null, 2)}\n`;

      // Remove "Props" suffix for filename
      const baseName = exportNode.name.replace(/Props$/, "");
      const outputPath = path.join(OUTPUT_DIR, `${kebabCase(baseName)}.json`);

      fs.writeFileSync(outputPath, json);
      console.log(`  Written: ${kebabCase(baseName)}.json`);
      componentCount++;
    } catch (error) {
      console.error(
        `  ⛔ Error formatting ${exportNode.name}: ${(error as Error).message}`,
      );
    }
  }

  console.log(`\n✅ Generated ${componentCount} reference files`);

  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} files had parsing issues (non-fatal)`);
  }
}

async function getFilesToProcess(
  options: RunOptions,
  configDir: string,
): Promise<string[]> {
  if (options.files && options.files.length > 0) {
    const files = await globby(options.files, {
      cwd: configDir,
      absolute: true,
      onlyFiles: true,
    });

    if (files.length === 0) {
      console.error("No files found matching the provided patterns.");
      process.exit(1);
    }

    return files;
  }

  // Default: find all types.ts files in ui folder
  const uiDir = path.join(configDir, "src/ui");
  const files = await globby("**/types.ts", {
    cwd: uiDir,
    absolute: true,
    onlyFiles: true,
  });

  return files;
}

yargs(hideBin(process.argv))
  .command<RunOptions>(
    "$0",
    "Extracts API documentation from TypeScript source files",
    (command) => {
      return command.option("files", {
        alias: "f",
        type: "array",
        demandOption: false,
        description:
          "Glob patterns for files to process. If not provided, all types.ts files are used.",
      });
    },
    run,
  )
  .help()
  .strict()
  .version(false)
  .parse();
